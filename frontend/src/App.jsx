import React, { useState } from "react";
import axios from "axios";

function App() {
  // States for Create Short URL
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  // States for Get URL Stats
  const [shortCodeStats, setShortCodeStats] = useState("");
  const [urlStats, setUrlStats] = useState("");

  // States for Update Short URL
  const [shortCodeUpdate, setShortCodeUpdate] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [updateResponse, setUpdateResponse] = useState("");

  // States for Delete Short URL
  const [shortCodeDelete, setShortCodeDelete] = useState("");
  const [deleteResponse, setDeleteResponse] = useState("");

  // States for Get Original URL
  const [shortCodeRetrieve, setShortCodeRetrieve] = useState("");
  const [originalUrl, setOriginalUrl] = useState("");

  // Inline CSS styles
  const styles = {
    body: {
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f4f4f4",
      padding: "20px",
      textAlign: "center",
    },
    app: {
      maxWidth: "800px",
      margin: "0 auto",
      padding: "20px",
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    },
    input: {
      padding: "10px",
      margin: "10px 0",
      width: "80%",
      maxWidth: "400px",
      border: "1px solid #ccc",
      borderRadius: "4px",
    },
    button: {
      padding: "10px 15px",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
    buttonHover: {
      backgroundColor: "#0056b3",
    },
    paragraph: {
      fontSize: "16px",
      fontWeight: "bold",
      color: "#333",
    },
    heading: {
      color: "#333",
    },
  };

  // Create Short URL
  const handleCreateShortUrl = async () => {
    try {
      const response = await axios.post("http://localhost:3000/shorten", {
        url: longUrl,
      });
      setShortUrl(`Short URL: ${window.location.origin}/shorten/${response.data.shortCode}`);
    } catch (error) {
      console.error("Error creating short URL", error);
    }
  };

  // Get URL Stats
  // const handleGetStats = async () => {
  //   try {
  //     const response = await axios.get(`http://localhost:3000/shorten/${shortCodeStats}/stats`);
  //     setUrlStats(`
  //       Short Code: ${response.data.shortCode}
  //       Original URL: ${response.data.url}
  //       Created At: ${new Date(response.data.createdAt).toLocaleString()}
  //       Updated At: ${new Date(response.data.updatedAt).toLocaleString()}
  //       Access Count: ${response.data.accessCount}
  //     `);
  //   } catch (error) {
  //     setUrlStats("Error: Short URL not found.");
  //   }
  // };
const handleGetStats = async () => {
  try {
    // Make the GET request to fetch stats
    const response = await axios.get(`http://localhost:3000/shorten/${shortCodeStats}/stats`);

    // Log the full response for debugging purposes
    console.log('Response from backend:', response.data);

    // Ensure that the URL field is correctly accessed from the response
    setUrlStats(`
      Short Code: ${response.data.shortCode}
      Original URL: ${response.data.originalUrl}  
      Created At: ${new Date(response.data.createdAt).toLocaleString()}
      Updated At: ${new Date(response.data.updatedAt).toLocaleString()}
      Access Count: ${response.data.accessCount}
    `);
  } catch (error) {
    // Handle errors if any
    setUrlStats("Error: Short URL not found.");
    console.error('Error fetching stats:', error);
  }
};

  // Update Short URL
  const handleUpdateUrl = async () => {
    try {
      const response = await axios.put(`http://localhost:3000/shorten/${shortCodeUpdate}`, {
        url: newUrl,
      });
      setUpdateResponse(`Updated URL: ${response.data.url}`);
    } catch (error) {
      setUpdateResponse("Error: Short URL not found.");
    }
  };

  // Delete Short URL
  const handleDeleteUrl = async () => {
    try {
      await axios.delete(`http://localhost:3000/shorten/${shortCodeDelete}`);
      setDeleteResponse("Short URL deleted successfully!");
    } catch (error) {
      setDeleteResponse("Error: Short URL not found.");
    }
  };

  // Get Original URL
  // const handleGetOriginalUrl = async () => {
  //   try {
  //     const response = await axios.get(`http://localhost:3000/shorten/${shortCodeRetrieve}`);
  //     setOriginalUrl(`Original URL: ${response.data.url}`);
  //   } catch (error) {
  //     setOriginalUrl("Error: Short URL not found.");
  //   }
  // };
  const handleGetOriginalUrl = async () => {
  const trimmedShortCode = shortCodeRetrieve.trim();  // Trim any leading/trailing spaces
  console.log('Fetching original URL for short code:', trimmedShortCode); // Log the short code

  try {
    const response = await axios.get(`http://localhost:3000/shorten/${trimmedShortCode}`);
    console.log('Response from backend:', response.data);  // Log the full response from the backend
    
    // Check if the response contains the correct field
    if (response.data && response.data.originalUrl) {
      setOriginalUrl(`Original URL: ${response.data.originalUrl}`);
    } else {
      setOriginalUrl("Error: Original URL not found.");
    }
  } catch (error) {
    setOriginalUrl("Error: Short URL not found.");
    console.error('Error fetching original URL:', error);
  }
};


  return (
    <div style={styles.app}>
      <h1 style={styles.heading}>URL Shortener</h1>

      {/* Create Short URL Section */}
      <div>
        <h2 style={styles.heading}>Create Short URL</h2>
        <input
          style={styles.input}
          type="text"
          placeholder="Enter your long URL here"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
        />
        <button
          style={styles.button}
          onClick={handleCreateShortUrl}
          onMouseEnter={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
        >
          Create Short URL
        </button>
        <p style={styles.paragraph}>{shortUrl}</p>
      </div>

      {/* Get URL Stats Section */}
      <div>
        <h2 style={styles.heading}>URL Statistics</h2>
        <input
          style={styles.input}
          type="text"
          placeholder="Enter short code to get stats"
          value={shortCodeStats}
          onChange={(e) => setShortCodeStats(e.target.value)}
        />
        <button
          style={styles.button}
          onClick={handleGetStats}
          onMouseEnter={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
        >
          Get Stats
        </button>
        <p style={styles.paragraph}>{urlStats}</p>
      </div>

      {/* Update Short URL Section */}
      <div>
        <h2 style={styles.heading}>Update Short URL</h2>
        <input
          style={styles.input}
          type="text"
          placeholder="Enter short code to update"
          value={shortCodeUpdate}
          onChange={(e) => setShortCodeUpdate(e.target.value)}
        />
        <input
          style={styles.input}
          type="text"
          placeholder="Enter new long URL"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
        />
        <button
          style={styles.button}
          onClick={handleUpdateUrl}
          onMouseEnter={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
        >
          Update URL
        </button>
        <p style={styles.paragraph}>{updateResponse}</p>
      </div>

      {/* Delete Short URL Section */}
      <div>
        <h2 style={styles.heading}>Delete Short URL</h2>
        <input
          style={styles.input}
          type="text"
          placeholder="Enter short code to delete"
          value={shortCodeDelete}
          onChange={(e) => setShortCodeDelete(e.target.value)}
        />
        <button
          style={styles.button}
          onClick={handleDeleteUrl}
          onMouseEnter={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
        >
          Delete URL
        </button>
        <p style={styles.paragraph}>{deleteResponse}</p>
      </div>

      {/* Get Original URL Section */}
      <div>
        <h2 style={styles.heading}>Get Original URL</h2>
        <input
          style={styles.input}
          type="text"
          placeholder="Enter short code to retrieve the original URL"
          value={shortCodeRetrieve}
          onChange={(e) => setShortCodeRetrieve(e.target.value)}
        />
        <button
          style={styles.button}
          onClick={handleGetOriginalUrl}
          onMouseEnter={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
        >
          Get Original URL
        </button>
        <p style={styles.paragraph}>{originalUrl}</p>
      </div>
    </div>
  );
}

export default App;
