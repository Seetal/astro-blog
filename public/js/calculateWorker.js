onmessage = (message) => {
  let total = 0;
  for(let i = 0; i < 5000000000; i++) {
    total++;
  }
  postMessage(total);
}