
export const initDB = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("QuizDB", 1);
  
      request.onerror = () => {
        reject("Error opening database");
      };
  
      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
  
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        if (!db.objectStoreNames.contains("quizResults")) {
          const store = db.createObjectStore("quizResults", { 
            keyPath: "id", 
            autoIncrement: true 
          });
          store.createIndex("date", "date", { unique: false });
          store.createIndex("score", "score", { unique: false });
        }
      };
    });
  };
  
  // Save Quiz Result
  export const addQuizResult = async (result) => {
    const db = await initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["quizResults"], "readwrite");
      const store = transaction.objectStore("quizResults");
  
      const request = store.add({
        date: new Date().toISOString(),
        score: result.score,
        totalQuestions: result.totalQuestions,
        timeTaken: result.timeTaken,
        answers: result.answers
      });
  
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject("Error adding result");
    });
  };
  
  // Get All Quiz Results
  export const getQuizResults = async () => {
    const db = await initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["quizResults"], "readonly");
      const store = transaction.objectStore("quizResults");
      const request = store.getAll();
  
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject("Error getting results");
    });
  };
  
  // Function to Get Last N Quiz Results
  export const getLastResults = async (n) => {
    const db = await initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["quizResults"], "readonly");
      const store = transaction.objectStore("quizResults");
      const request = store.getAll();
  
      request.onsuccess = () => {
        const allResults = request.result;
        resolve(allResults.slice(-n));
      };
      request.onerror = () => reject("Error getting results");
    });
  };
  