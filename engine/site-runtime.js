import {build,createServer,preview} from 'vite';
import config from '../vite.config.js';
// Load the native ESM config directly so linked dependencies work on Windows.
const options={...config,configFile:false};
const mode=process.argv[2] || 'dev';
if(mode==='build')await build(options);
else if(mode==='preview'){const app=await preview({...options,preview:{host:'127.0.0.1',port:3001}});app.printUrls();}
else {const app=await createServer({...options,server:{...config.server,host:'127.0.0.1'}});await app.listen();app.printUrls();}
