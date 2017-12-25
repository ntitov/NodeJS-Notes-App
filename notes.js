const fs = require('fs');

const command = process.argv[2];
const title = process.argv[3];
const content = process.argv[4];

switch (command) {
    case 'list':
        list((er, notes) => {
            if(er) return console.log(er.message);
            notes.forEach((note, index) => console.log(`${index + 1}. ${note.title}`));
        });
        break;
    case 'view':
        view(title, (er, note) => {
            if(er) return console.log(er.message);
            console.log(`# ${note.title}\r\n\r\n---\r\n\r\n${note.content}`); 
        });
        break;
    case 'create':
        create(title, content, (er) => {
            if(er) return console.log(er.message);
            console.log('Note created!')
        });
        break;
    case 'remove':
        remove(title, (er) => {
            if(er) return console.log(er.message);
            console.log('Note remove!')
        });
        break;
    default:
        console.log("Don't now command. Please retry.")
        break;
}

function list(done) {
    // fs.readFile('notes.json', (er, data) => {
    //     if(er) return done(er);
    //     const notes = JSON.parse(data);
    //     done(null, notes);
    // })
    load(done);
}

function view(title, done) {
    // fs.readFile('notes.json', (er, data) => {
    //     if(er) return done(er);
    //     const notes = JSON.parse(data);
    //     const note = notes.find(note => note.title === title);

    //     if(!note) return done(new Error('Note not found!'));

    //     done(null, note);
    // })
    load((er, notes) => {
        if(er) return done(er);
        const note = notes.find(note => note.title === title);

        if(!note) return done(new Error('Note not found!'));

        done(null, note);
    })
}

function create(title, content, done) {
    // fs.readFile('notes.json', (er, data) => {
    //     if(er) return done(er);
    //     const notes = JSON.parse(data);
    //     notes.push({title, content});
    //     const json = JSON.stringify(notes);
    //     fs.writeFile('notes.json', json, er => {
    //         if(er) return done(er);
    //         done();
    //     })
    // })
    load((er, notes) => {
        if(er) return done(er);

        notes.push({title, content});
        
        save(notes, done);
    })
}

function remove(title, done) {
    // fs.readFile('notes.json', (er, data) => {
    //     if(er) return done(er);
    //     let notes = JSON.parse(data);

    //     notes = notes.filter(note => note.title !== title);


    //     const json = JSON.stringify(notes);
    //     fs.writeFile('notes.json', json, er => {
    //         if(er) return done(er);
    //         done();
    //     })
    // })
    load((er, notes) => {
        if(er) return done(er);

        notes = notes.filter(note => note.title !== title);

        save(notes, done);

    })
}

function load(done) {
    fs.readFile('notes.json', (er, data) => {
        if(er) {
            if(er.code = 'ENOENT'){
                return done(null, []);
            } else {
                return done(er);
            }
        }
        try {
            const notes = JSON.parse(data);
            done(null, notes);
        } catch (error) {
            done(new Error('Not can read file'));
        }

        
    })
}

function save(notes, done) {
    try {
        const json = JSON.stringify(notes);
        fs.writeFile('notes.json', json, er => {
            if(er) return done(er);
            done();
        })
    } catch (error) {
        done(error);
    }
}