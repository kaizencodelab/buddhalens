import { auth, db } from '../config/firebase.js';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import * as d3 from "d3";

let currentUser = null;

// --- Auth Check ---
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // User is signed in
        currentUser = user;
        const emailEl = document.getElementById('user-email');
        if (emailEl) emailEl.textContent = user.email;

        await loadUserData(); // Load data from Firestore
        init(); // Load graph data
    } else {
        // User is signed out
        window.location.href = 'login.html';
    }
});

const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            await signOut(auth);
            window.location.href = 'index.html';
        } catch (error) {
            console.error("Error signing out:", error);
        }
    });
}

// --- Data & State ---
let graphData = { nodes: [], links: [] };
let receivedIds = [];

async function loadUserData() {
    if (!currentUser) return;

    const userRef = doc(db, "users", currentUser.uid);
    try {
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
            receivedIds = docSnap.data().receivedIds || [];
        } else {
            // Check for local data to migrate
            const localData = JSON.parse(localStorage.getItem('buddhalens_received'));
            if (localData && localData.length > 0) {
                receivedIds = localData;
                await saveUserData(); // Sync to cloud
                // Optional: Clear local storage after migration
                // localStorage.removeItem('buddhalens_received');
            } else {
                receivedIds = [];
            }
        }
    } catch (error) {
        console.error("Error loading user data:", error);
    }
}

async function saveUserData() {
    if (!currentUser) return;

    const userRef = doc(db, "users", currentUser.uid);
    try {
        await setDoc(userRef, {
            receivedIds: receivedIds,
            email: currentUser.email,
            lastUpdated: new Date()
        }, { merge: true });
    } catch (error) {
        console.error("Error saving user data:", error);
    }
}

// --- Graph Setup ---
const mainContent = document.querySelector('.main-content');
let width = 800;
let height = 600;

if (mainContent) {
    width = mainContent.clientWidth;
    height = mainContent.clientHeight;
}

const svg = d3.select("#graph-container").append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", [0, 0, width, height]);

const g = svg.append("g");

const zoom = d3.zoom()
    .scaleExtent([0.1, 4])
    .on("zoom", (event) => g.attr("transform", event.transform));
svg.call(zoom);

const simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(d => d.id).distance(150))
    .force("charge", d3.forceManyBody().strength(-400))
    .force("center", d3.forceCenter(width / 2, height / 2));

// --- Main Logic ---
async function init() {
    try {
        const resp = await fetch('data/lineage.json');
        graphData = await resp.json();

        renderList();
        renderGraph();
    } catch (err) {
        console.error("Failed to load data", err);
    }
}

async function toggleTransmission(id) {
    const index = receivedIds.indexOf(id);
    if (index === -1) {
        receivedIds.push(id);
    } else {
        receivedIds.splice(index, 1);
    }

    // Optimistic UI update
    renderGraph();
    renderList();

    // Sync to cloud
    await saveUserData();
}

function renderList() {
    const list = document.getElementById('lineage-list');
    if (!list) return;
    list.innerHTML = '';

    graphData.nodes.forEach(node => {
        const li = document.createElement('li');
        li.className = 'lineage-item';

        const label = document.createElement('label');
        label.style.display = 'flex';
        label.style.alignItems = 'center';
        label.style.cursor = 'pointer';
        label.style.width = '100%';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = receivedIds.includes(node.id);
        checkbox.style.marginRight = '10px';
        checkbox.onchange = () => toggleTransmission(node.id);

        const text = document.createElement('span');
        text.textContent = node.name;

        label.appendChild(checkbox);
        label.appendChild(text);
        li.appendChild(label);
        list.appendChild(li);
    });
}

function renderGraph() {
    // Clear existing
    g.selectAll("*").remove();

    // Links
    const link = g.append("g")
        .selectAll("line")
        .data(graphData.links)
        .join("line")
        .attr("class", d => {
            // Check if both source and target are "received"
            // Note: d3 converts source/target to objects after simulation start, 
            // but on first run they might be strings. Handle both.
            const sId = typeof d.source === 'object' ? d.source.id : d.source;
            const tId = typeof d.target === 'object' ? d.target.id : d.target;

            if (receivedIds.includes(sId) && receivedIds.includes(tId)) {
                return "link received-link";
            }
            return "link";
        });

    // Nodes
    const node = g.append("g")
        .selectAll("g")
        .data(graphData.nodes)
        .join("g")
        .attr("class", d => receivedIds.includes(d.id) ? "node received-node" : "node")
        .call(drag(simulation));

    node.append("circle")
        .attr("r", 10)
        .attr("fill", "#6b7280");

    node.append("text")
        .attr("dx", 15)
        .attr("dy", 4)
        .text(d => d.name);

    simulation.nodes(graphData.nodes).on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
        node
            .attr("transform", d => `translate(${d.x},${d.y})`);
    });

    simulation.force("link").links(graphData.links);
    simulation.alpha(1).restart();
}

// Drag helpers
function drag(simulation) {
    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
}
