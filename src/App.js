import React, { useState, useEffect } from 'react';
import './App.css';
import logoImage from './logo.png';

const App = () => {
    const [snippets, setSnippets] = useState([]);
    const [newSnippet, setNewSnippet] = useState('');
    const [editingIndex, setEditingIndex] = useState(-1);

    useEffect(() => {
        // Load the saved snippets from chrome.storage.local on mount
        chrome.storage.local.get(['snippets'], function(result) {
            if (result.snippets) {
                setSnippets(result.snippets);
            }
        });
    }, []);

    const saveSnippet = () => {
        const updatedSnippets = [...snippets];

        if (editingIndex >= 0) {
            // Update an existing snippet
            updatedSnippets[editingIndex] = newSnippet;
            setEditingIndex(-1);
        } else {
            // Add a new snippet
            updatedSnippets.push(newSnippet);
        }

        // Save the snippets to chrome.storage.local
        chrome.storage.local.set({ snippets: updatedSnippets }, () => {
            setSnippets(updatedSnippets);
            setNewSnippet('');
        });
    };

    const copyToClipboard = (snippet, index) => {
        navigator.clipboard.writeText(snippet);
        document.getElementById(`copy-button-${index}`).innerText = 'Copied!';
        setTimeout(() => {
            document.getElementById(`copy-button-${index}`).innerText = snippet;
        }, 500); // Change the text back after 0.5 seconds
    };

    const editSnippet = (index) => {
        setNewSnippet(snippets[index]);
        setEditingIndex(index);
    };

    const deleteSnippet = (index) => {
        const updatedSnippets = snippets.filter((_, i) => i !== index);
        // Update chrome.storage.local after deletion
        chrome.storage.local.set({ snippets: updatedSnippets }, () => {
            setSnippets(updatedSnippets);
            if (index === editingIndex) {
                setEditingIndex(-1); // Cancel editing if the snippet is being deleted
                setNewSnippet('');
            }
        });
    };

    return (
        <div className="app">
            <img src={logoImage} alt="Logo" className="logo"/>
            <div className="input-section">
                <input
                    type="text"
                    placeholder="Enter text here"
                    value={newSnippet}
                    onChange={(e) => setNewSnippet(e.target.value)}
                    className="input-field"
                />
                <button onClick={saveSnippet} className="save-button">
                    {editingIndex >= 0 ? 'Update Prompt' : 'Save Prompt'}
                </button>
            </div>
            <div className="list-section">
                {snippets.map((snippet, index) => (
                    <div key={index} className="snippet-item">
                        <button
                            id={`copy-button-${index}`}
                            onClick={() => copyToClipboard(snippet, index)}
                            className="snippet-button"
                        >
                            {snippet}
                        </button>
                        <button onClick={() => editSnippet(index)} className="edit-button">
                            Edit
                        </button>
                        <button onClick={() => deleteSnippet(index)} className="delete-button">
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default App;
