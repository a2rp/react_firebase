import { createElement, useEffect, useState } from "react";
import {
  FaArrowRight,
  FaCoffee,
  FaFacebook,
  FaGithub,
  FaGlobe,
  FaHeart,
  FaLinkedin,
  FaPatreon,
  FaPlus,
  FaSyncAlt,
  FaTrash,
  FaUser,
  FaYoutube,
} from "react-icons/fa";
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "./firebase-config";
import "./App.css";

const usersCollectionRef = collection(db, "users");

const socialLinks = [
  { label: "Portfolio", href: "https://www.ashishranjan.net/", icon: FaGlobe },
  { label: "GitHub", href: "https://github.com/a2rp", icon: FaGithub },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/aashishranjan", icon: FaLinkedin },
  { label: "Facebook", href: "https://www.facebook.com/theash.ashish/", icon: FaFacebook },
  { label: "YouTube", href: "https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1", icon: FaYoutube },
];

const supportLinks = [
  { label: "Support", href: "https://a2rp-donation-page.netlify.app/", icon: FaHeart },
  { label: "Buy Me a Coffee", href: "https://buymeacoffee.com/a2rp", icon: FaCoffee },
  { label: "Patreon", href: "https://www.patreon.com/a2rp", icon: FaPatreon },
];

function App() {
  const [form, setForm] = useState({ name: "", age: "" });
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadUsers = async () => {
      try {
        const snapshot = await getDocs(usersCollectionRef);
        if (isMounted) {
          setUsers(snapshot.docs.map((item) => ({ ...item.data(), id: item.id })));
        }
      } catch (loadError) {
        if (isMounted) setError(loadError.message || "Users could not be loaded.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadUsers();
    return () => {
      isMounted = false;
    };
  }, []);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError("");
    setNotice("");
  };

  const createUser = async (event) => {
    event.preventDefault();
    const name = form.name.trim();
    const age = Number(form.age);

    if (!name || form.age === "" || Number.isNaN(age) || age < 0) {
      setError("Enter a name and a valid non-negative age.");
      return;
    }

    setIsSaving(true);
    setError("");
    setNotice("");
    try {
      const created = await addDoc(usersCollectionRef, { name, age });
      setUsers((current) => [...current, { id: created.id, name, age }]);
      setForm({ name: "", age: "" });
      setNotice("User created successfully.");
    } catch (createError) {
      setError(createError.message || "User could not be created.");
    } finally {
      setIsSaving(false);
    }
  };

  const updateUser = async (user) => {
    setBusyId(user.id);
    setError("");
    setNotice("");
    try {
      const nextAge = Number(user.age) + 1;
      await updateDoc(doc(db, "users", user.id), { age: nextAge });
      setUsers((current) => current.map((item) => item.id === user.id ? { ...item, age: nextAge } : item));
      setNotice(`${user.name}'s age was increased.`);
    } catch (updateError) {
      setError(updateError.message || "User could not be updated.");
    } finally {
      setBusyId("");
    }
  };

  const deleteUser = async (id) => {
    setBusyId(id);
    setError("");
    setNotice("");
    try {
      await deleteDoc(doc(db, "users", id));
      setUsers((current) => current.filter((item) => item.id !== id));
      setNotice("User deleted successfully.");
    } catch (deleteError) {
      setError(deleteError.message || "User could not be deleted.");
    } finally {
      setBusyId("");
    }
  };

  return (
    <div className="app">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Firebase user manager home">
          <img src="/logo.png" alt="Ashish Ranjan logo" />
          <span><small>FIREBASE CRUD DEMO</small><strong>User Manager</strong></span>
        </a>
        <a className="github-link" href="https://github.com/a2rp/react_firebase" target="_blank" rel="noopener noreferrer" aria-label="Open repository">
          <FaGithub />
        </a>
      </header>

      <main id="top" className="main-content">
        <section className="hero">
          <div>
            <p className="eyebrow">React + Firestore</p>
            <h1>Manage a small user list with clear CRUD actions.</h1>
            <p className="hero-text">Create users, increase their age, and remove records from a focused Firestore dashboard.</p>
          </div>
          <div className="hero-meta">
            <span><FaSyncAlt /> Firestore connected</span>
            <strong>{users.length} users</strong>
          </div>
        </section>

        <section className="workspace">
          <form className="user-form panel" onSubmit={createUser}>
            <div className="panel-heading"><span className="panel-icon"><FaUser /></span><div><p className="eyebrow">New record</p><h2>Create user</h2></div></div>
            <label htmlFor="name">Name</label>
            <input id="name" name="name" type="text" value={form.name} placeholder="Enter a name" onChange={updateField} />
            <label htmlFor="age">Age</label>
            <input id="age" name="age" type="number" min="0" value={form.age} placeholder="Enter an age" onChange={updateField} />
            <button className="primary-button" type="submit" disabled={isSaving}>{isSaving ? "Saving..." : "Create user"} <FaPlus /></button>
          </form>

          <section className="users-panel panel" aria-labelledby="users-heading">
            <div className="panel-heading users-heading"><div><p className="eyebrow">Firestore collection</p><h2 id="users-heading">Users</h2></div><span className="count-badge">{users.length}</span></div>
            {error && <p className="message error" role="alert">{error}</p>}
            {notice && <p className="message success" role="status">{notice}</p>}
            {isLoading && <div className="empty-state">Loading users...</div>}
            {!isLoading && !error && users.length === 0 && <div className="empty-state">No users yet. Add the first record.</div>}
            {!isLoading && users.length > 0 && <div className="user-list">
              {users.map((user) => <article className="user-row" key={user.id}>
                <div className="user-details"><span className="avatar">{user.name.charAt(0).toUpperCase()}</span><div><strong>{user.name}</strong><span>Age {user.age}</span></div></div>
                <div className="row-actions">
                  <button className="action-button update" type="button" onClick={() => updateUser(user)} disabled={busyId === user.id} aria-label={`Increase age for ${user.name}`}><FaArrowRight /> Age +1</button>
                  <button className="action-button delete" type="button" onClick={() => deleteUser(user.id)} disabled={busyId === user.id} aria-label={`Delete ${user.name}`}><FaTrash /></button>
                </div>
              </article>)}
            </div>}
          </section>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <span>Copyright © {new Date().getFullYear()} <a href="https://www.ashishranjan.net/" target="_blank" rel="noopener noreferrer">Ashish Ranjan</a></span>
          <div className="footer-links">
            {[...socialLinks, ...supportLinks].map(({ label, href, icon }) => <a href={href} key={label} target="_blank" rel="noopener noreferrer" aria-label={label} title={label}>{createElement(icon)}</a>)}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
