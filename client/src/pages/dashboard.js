import { auth, db } from '../config/firebase.js';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

let currentUser = null;

// --- Auth Check ---
onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        const emailEl = document.getElementById('user-email');
        if (emailEl) emailEl.textContent = user.email;

        await loadUserData();
        init();
    } else {
        window.location.href = 'login.html';
    }
});

const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            await signOut(auth);
            window.location.href = '/index.html';
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
        receivedIds = docSnap.exists() ? (docSnap.data().receivedIds || []) : [];
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

// --- Main Logic ---
async function init() {
    try {
        const resp = await fetch('/data/lineage.json');
        graphData = await resp.json();
        render();
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

    render();
    await saveUserData();
}

function getTransmissionsForNode(nodeId) {
    return graphData.links
        .filter(l => l.source === nodeId || l.target === nodeId)
        .map(l => l.transmission)
        .filter(Boolean);
}

function render() {
    const list = document.getElementById('lineage-list');
    if (!list) return;
    list.innerHTML = '';

    graphData.nodes.forEach(node => {
        const received = receivedIds.includes(node.id);
        const transmissions = getTransmissionsForNode(node.id);

        const li = document.createElement('li');
        li.className = 'lineage-item' + (received ? ' received' : '');

        const label = document.createElement('label');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = received;
        checkbox.onchange = () => toggleTransmission(node.id);

        const textBlock = document.createElement('div');
        textBlock.className = 'lineage-text';

        const name = document.createElement('span');
        name.className = 'lineage-name';
        name.textContent = node.name;

        const meta = document.createElement('span');
        meta.className = 'lineage-meta';
        meta.textContent = [node.dob, node.occupation].filter(Boolean).join(' · ');

        textBlock.appendChild(name);
        if (meta.textContent) textBlock.appendChild(meta);

        if (transmissions.length > 0) {
            const tx = document.createElement('span');
            tx.className = 'lineage-transmission';
            tx.textContent = transmissions.join(', ');
            textBlock.appendChild(tx);
        }

        label.appendChild(checkbox);
        label.appendChild(textBlock);
        li.appendChild(label);
        list.appendChild(li);
    });
}
