// es un XMLHttpRequest que nos permite hacer llamadas a la api,
// y tiene para ver el proceso de subida de un archivo
// lo llamamos fetch, ya que lo usamos igual que el fetch original (misma estructura)

const fetch = (url, opts={}, onProgress) => {
   console.log(url, opts)
   return new Promise( (res, rej)=>{
      let xhr = new XMLHttpRequest();
      xhr.open(opts.method || 'get', url);
      for (let k in opts.headers||{})
         xhr.setRequestHeader(k, opts.headers[k]);
      xhr.onload = e => res(e.target);
      xhr.onerror = rej;
      if (xhr.upload && onProgress)
         xhr.upload.onprogress = onProgress; // event.loaded / event.total * 100 ; //event.lengthComputable
      xhr.send(opts.body);
   });
}
export default fetch