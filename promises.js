//* 🏆 Snack 1
//Ottieni il titolo di un post con una Promise.
// Crea una funzione getPostTitle(id) che accetta un id 
// e restituisce una Promise che recupera il titolo di un post dal link https://dummyjson.com/posts/{id}

function getPostTitle(id) {
    return new Promise ((resolve, reject) => {
        fetch(`https://dummyjson.com/posts/${id}`)
        .then(response => {
            if (!response.ok) {
                // Se la risposta non è OK (es. 404, 500), rifiuta la promise
                // con un messaggio di errore più specifico basato sullo stato.
                return reject(new Error(`Errore HTTP! Stato: ${response.status} - Impossibile trovare il post con ID ${id}.`));
            }
            return response.json(); // Parsa il corpo JSON
            })
        .then(post => {
            if (post && post.title) {
                resolve(post.title); // Risolvi con il titolo del post
            } else {
                reject(new Error(`Il post con ID ${id} non contiene un titolo valido.`));
            }
        })
        .catch(error => {
            // Cattura eventuali errori di rete o problemi durante l'operazione di fetch
            reject(new Error(`Errore nella richiesta per il post con ID ${id}: ${error.message}`));
        });
    });
}

// Esempio:
getPostTitle(1)
    .then(title => console.log("Titolo del post:", title))
    .catch(error => console.error("Errore:", error.message));

// Esempio con un ID non esistente
getPostTitle(9999)
    .then(title => console.log("Titolo del post:", title))
    .catch(error => console.error("Errore:", error.message));

// Esempio con un ID non valido
getPostTitle('abc')
    .then(title => console.log("Titolo del post:", title))
    .catch(error => console.error("Errore:", error.message));

//# 🎯 Bonus: Ottieni l'intero post con l'autore
// Crea una funzione getPost(id) che recupera l'intero post. 
// Concatena una seconda chiamata che aggiunge una proprietà user che contiene i dati dell'autore,
// recuperati dalla chiamata https://dummyjson.com/users/{post.userId}.

function getPost(id) {
    return new Promise((resolve, reject) => {
        // Prima chiamata: recupero i dati del post
        fetch(`https://dummyjson.com/posts/${id}`)
            .then(response => {
                if (!response.ok) {
                    return reject(new Error(`Errore HTTP! Stato: ${response.status}`));
                }
                return response.json();
            })
            .then(post => {
                // Dopo aver ottenuto il post, recuperp i dati dell'autore
                // Uso post.userId per ottenere l'ID dell'autore
                return fetch(`https://dummyjson.com/users/${post.userId}`)
                    .then(response => {
                        if (!response.ok) {
                            // Se l'utente non viene trovato, posso scegliere di:
                            // 1. Rifiutare completamente la promise (mia scelta)
                            // 2. Risolvere il post senza i dati dell'utente con un messaggio di avviso
                            return reject(new Error(`Errore HTTP! Stato: ${response.status}`));
                        }
                        return response.json();
                    })
                    .then(user => {
                        // Aggiungo la proprietà 'user' al post e risolvo
                        post.user = user;
                        resolve(post);
                    });
            })
            .catch(error => {
                // Catturo eventuali errori di rete o altri problemi
                reject(new Error(`Errore durante il recupero del post o dell'autore per il post con ID ${id}: ${error.message}`));
            });
    });
}

// esempi 
// 1. Ottenere un post esistente con l'autore
getPost(5)
    .then(post => {
        console.log("Post completo con autore:", post);
        console.log("Titolo:", post.title);
        console.log("Nome Autore:", post.user.firstName, post.user.lastName);
    })
    .catch(error => console.error("Errore:", error.message));

// 2. Tentare di ottenere un post non esistente
getPost(9999)
    .then(post => console.log("Post completo con autore:", post))
    .catch(error => console.error("Errore:", error.message));



//* 🏆 Snack 2
// Crea la funzione lanciaDado() che restituisce una Promise che, dopo 3 secondi, 
// genera un numero casuale tra 1 e 6. Tuttavia, nel 20% dei casi, il dado si "incastra" e la Promise va in reject.


//#🎯 Bonus: HOF con closure per memorizzare l'ultimo lancio
// Modifica la funzione in creaLanciaDado(), che restituisce una closure che memorizza l'ultimo risultato. 
// Se il numero esce due volte di fila, stampa "Incredibile!".