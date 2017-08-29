// ES6 Destructuring : posso ricavare proprietà di un oggetto in ES6
// var persona = {nome: 'Francesco', età: 41};
// var {nome} = persona;
// console.log(nome); // Francesco


// npm install mongodb --save (dipendenza regolare per le connessioni al db mongo)
// Parte Mongo Client che permette connessioni al db

// In mongodb non bisogna creare il db ma scriverlo soltanto come primo parametro (vedi sotto) passato al metodo .connect() specificando il nome
// finchè non vengono inseriti dati si ha connessione la db ma non lo vediamo dal pannello di Robo3t.

// includo MongoClient
// const MongoClient = require('mongodb').MongoClient;
// destrutturo per tirar giu proprietà dalla libreria MongoDB
// ciò crea costante chiamata MongoClient settata uguale alla proprietà MongoClient dalla quale prenderemo i metodi
// ObjectID è un costruttore che permette di creare nuovi oggetti ID
const {MongoClient, ObjectID} = require('mongodb');

// creo nuovo oggettoID
var obj = new ObjectID();
console.log(obj); // 59a419a1387e4939b3aff243 ho già l'id dell'oggetto


// // creo connessione al db
// // accetta 2 argomenti :
// // I Stringa rappresenta url db ()
// // per connetterci dobbiamo usare il protocollo mongoDb MongoClient.connect('mongodb://urldb/db')
// // II callback invocata dopo la richiesta, se tutto ok possiamo connetterci sennò rimanda msg errore
// // prende 2 argomenti: 1 msg errore può o non essrci,
// // 2 db object che ci serve per leggere e scrivere dati
 MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
     // usiamo return per ritornare il messaggio ed impedire quindi ulteriore codice di essere eseguito fermando il programma
    return console.log('Impossibile connettersi al Server MongoDB.');
  }
});
  // inserisco dati nella collezione db prende solo 1 argomento la stringa che rappresenta la collezione e la nomino come mi pare come per il db
  // .insertOne permette di aggiungere nuovo documento nella collezione
  // prende 2 arg: I oggetto js con chiave valore per i dati, II callback che viene invocata se le cose sono andate sia bene che male
  // 1 msg errore se esiste, oggetto result che viene reso accessibile se le cose sono andate a buon fine
  // db.collection('Todos').insertOne({
  //   testo: 'Qualcosa da fare',
  //   completato: false
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Impossibile aggiungere todo', err); // fermo codice stampo msg errore ed oggetto errore
  //   }
  //   // se andato a buon fine stampo oggetto JSON che racchiude documenti
  //   // attributo ops racchiude tutti i documenti inseriti
  //   console.log(JSON.stringify(result.ops, undefined, 2));

// db.collection('Users').insertOne({
//   nome: 'Francesco Brachini',
//   eta: 41,
//   località: 'Perugia'
// }, (err, result) => {
//     if (err) {
//       return console.log('Impossibile aggiungere utente', err); // fermo codice stampo msg errore ed oggetto errore
//     }
//     console.log(JSON.stringify(result.ops, undefined, 2));
//   });
//   console.log('Connessione al Server MongoDB attiva.');
//   db.close();
// });


// L'ID è valore 12 byte primi 4 byte rappresentano orario in cui l'id è stato creato
// altri 3 byte dopo identificano la macchina, cioè se due pc generano l'id della macchina sarà diverso -> assicura unicità id
// altri 2 byte processo id -> altro identificatore univoco
// ultimi 3 byte sono contatore rappresentano numero random
// possiamo creare noi id come vogliamo inserendoli nell'oggetto :
//db.collection('Todos').insertOne({
//   _id:
//   testo: 'Qualcosa da fare',//
//   completato: false
// },.....
// avremo così tanti oggetti specifici con id unico

// Conoscere la data di inserimento tramite ID

// db.collection('Users').insertOne({
//   nome: 'Francesco Brachini',
//   eta: 41,
//   località: 'Perugia'
// }, (err, result) => {
//     if (err) {
//       return console.log('Impossibile aggiungere utente', err); // fermo codice stampo msg errore ed oggetto errore
//     }
//     // l'array result.ops contiene tutti i documenti inseriti e il primo valore è il db avendone solo uno per dire,
//     // acceddo alla proprietà ._id che ritorna l'id dell'oggetto, possiamo usare il metodo specifico di ._id.getTimestamp che non accetta argomenti e ritorna la data in formato GMT
//     console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
//   });
//   console.log('Connessione al Server MongoDB attiva.');
//   db.close();
// });
