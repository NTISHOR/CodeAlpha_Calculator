let display = document.getElementById('display');
let historyDiv = document.getElementById('history');
let memory = 0;
let isDeg = true;

// Handle button clicks
document.querySelectorAll('.buttons button').forEach(btn => {
  btn.onclick = () => handleInput(btn.innerText);
});

function handleInput(val) {
  if(val==='C') clearDisplay();
  else if(val==='⌫') backspace();
  else if(val==='π') append(Math.PI);
  else if(val==='e') append(Math.E);
  else if(val==='sin') append(`Math.sin(${isDeg?'Math.PI/180*':''}`);
  else if(val==='cos') append(`Math.cos(${isDeg?'Math.PI/180*':''}`);
  else if(val==='tan') append(`Math.tan(${isDeg?'Math.PI/180*':''}`);
  else if(val==='x²') append('**2');
  else if(val==='xʸ') append('**');
  else if(val==='x!') factorial();
  else if(val==='log') append('Math.log10(');
  else if(val==='√') append('Math.sqrt(');
  else if(val==='M+') memory += Number(display.innerText);
  else if(val==='M-') memory -= Number(display.innerText);
  else if(val==='MR') display.innerText = memory;
  else if(val==='=') calculate();
  else append(val);
}

function append(v){ display.innerText = display.innerText==='0'?v:display.innerText+v; }
function clearDisplay(){ display.innerText='0'; }
function backspace(){ display.innerText = display.innerText.slice(0,-1) || '0'; }

function calculate(){
  try {
    let expr = display.innerText;
    let openParens = (expr.match(/\(/g)||[]).length;
    let closeParens = (expr.match(/\)/g)||[]).length;
    expr += ')'.repeat(openParens - closeParens);

    let result = eval(expr);
    historyDiv.innerHTML += `<div>${display.innerText} = ${result}</div>`;
    display.innerText = result;
  } catch {
    display.innerText = 'Error';
  }
}

function factorial(){
  let n = eval(display.innerText);
  if(n < 0) return display.innerText = 'Error';
  let res = 1;
  for(let i=1;i<=n;i++) res*=i;
  display.innerText = res;
}

// DEG/RAD Toggle
document.getElementById('modeBtn').onclick = () => {
  isDeg = !isDeg;
  document.getElementById('modeBtn').innerText = isDeg ? 'DEG' : 'RAD';
};

// Keyboard input
document.addEventListener('keydown', e => {
  if((e.key>='0' && e.key<='9') || ['+','-','*','/','.'].includes(e.key)) append(e.key);
  else if(e.key==='Enter') calculate();
  else if(e.key==='Backspace') backspace();
  else if(e.key.toLowerCase()==='c') clearDisplay();
});

// Fully hands-free voice input
document.getElementById('voiceBtn').onclick = () => {
  const rec = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  rec.onresult = e => {
    let t = e.results[0][0].transcript.toLowerCase().trim();

    // Replace words with operators
    t = t.replace(/plus/gi,'+')
         .replace(/minus/gi,'-')
         .replace(/times|multiply/gi,'*')
         .replace(/divide/gi,'/')
         .replace(/x\^|power/gi,'**')
         .replace(/ /g,'');

    // Functions with Math equivalents
    t = t.replace(/sin(\d+(\.\d+)?)/gi, (_, num) => `Math.sin(${isDeg?'Math.PI/180*'+num:num})`);
    t = t.replace(/cos(\d+(\.\d+)?)/gi, (_, num) => `Math.cos(${isDeg?'Math.PI/180*'+num:num})`);
    t = t.replace(/tan(\d+(\.\d+)?)/gi, (_, num) => `Math.tan(${isDeg?'Math.PI/180*'+num:num})`);
    t = t.replace(/log(\d+(\.\d+)?)/gi, (_, num) => `Math.log10(${num})`);
    t = t.replace(/sqrt(\d+(\.\d+)?)/gi, (_, num) => `Math.sqrt(${num})`);

    display.innerText = t;

    try {
      let openParens = (t.match(/\(/g)||[]).length;
      let closeParens = (t.match(/\)/g)||[]).length;
      t += ')'.repeat(openParens - closeParens);

      let result = eval(t);
      historyDiv.innerHTML += `<div>${display.innerText} = ${result}</div>`;
      display.innerText = result;
    } catch {
      display.innerText = 'Error';
    }
  };
  rec.start();
};