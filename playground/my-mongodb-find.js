// prendiamo dati da mongodb
const {MongoClient, ObjectID} = require('mongodb');
var obj = new ObjectID();
console.log(obj);
//  MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
//   if (err) {
//     return console.log('Impossibile connettersi al Server MongoDB.');
//   }
//   // accedo alla collezione passandola come stringa usando il metodo .find()
//   // se non passo argomenti a find ritorna tutta la collezione
//   // in realtà ritorna un mongoDB cursor che non è il documento stesso ma un puntatore al documento e usando i suoi metodi
//   // risuciamo a risalire al documento
//
//   // metodo toArray del cursor ritorna array dei documenti
//   // toArray rotirna una promise quindi possiamo chiamare .then() con una callback e se tutto va bene otteniamo i dati a schermo
//   // trovo gli elementi con completed: false all'interno di Todos impostando dentro .find({completed: false}) uso oggetto con chiave valore
//   db.collection('Todos').find({completed: false}).toArray().then((docs) => {
//     console.log('Todos');
//     console.log(JSON.stringify(docs, undefined, 2));
//   }, (err) => {
//     console.log('Impossibile recuperare i Todos', err);
//   });
//   //db.close();
// });

// esempi

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
 if (err) {
   return console.log('Impossibile connettersi al Server MongoDB.');
 }

 // altro esmpio cercando con proprietà _id
 // creo nuovo oggetto per prassi funziona anche senza new ma va tenuto e passo argomento che è richiesto, l'id oggetto come stringa
 //
 // db.collection('Todos').find({_id: new ObjectID('59a3e727265bfa2519c79d21')})
 // .toArray().then((docs) => {
 //   console.log('Todos');
 //   console.log(JSON.stringify(docs, undefined, 2));
 // }, (err) => {
 //   console.log('Impossibile recuperare i Todos', err);
 // });

// invocando .find() che ritorna Cursor accediamo al metodo di Cursor .count() che ritorna promise (vedere documentazione)
// db.collection('Todos').find().count().then((count) => {
//    console.log(`Todos count: ${count}`);
// }, (err) => {
//    console.log('Impossibile recuperare i Todos', err);
// });

// esercizio: trovo tutti gli Users con nome Francesco
db.collection('Users').find({nome: "Francesco"}).toArray().then((nome) => {
  console.log(JSON.stringify(nome, undefined, 2));
}, (err) => {
  console.log('Impossibile trovare il nome', err);
});



 // la connessione in chiusura npn sempre va gestita da noi..(vedere prx lezioni)
 //db.close();
});
