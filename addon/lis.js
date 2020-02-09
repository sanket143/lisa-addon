function renderSearch(arr){
  html_text = ""

  data = JSON.parse(arr)
  for(i = 0; i < data.length; i++){

    item = data[i]
    html_text += `
    <div class="bkWMgd">
    <a href="file://${item.url}" target="_blank" ><h1 style="font-size: 18px;">${item.title}</h1></a>
    <h3 style="font-size: 12px">${item.url}</h3>
    <p class="st" style="font-size: 13px;">${item.content}</p>
    </div>
    `
  }
  google_html = document.getElementById("rso").innerHTML
  document.getElementById("rso").innerHTML = html_text + google_html
}

function httpGet(theUrl)
{
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
  xmlHttp.send( null );
  return xmlHttp.responseText;
}

function renderHTML(html){
  google_html = document.getElementById("rso").innerHTML
  document.getElementById("rso").innerHTML = html + google_html
}

window.onload = function(){
  q = document.querySelectorAll('[name="q"]');
  if(q.length){

    q_value = q[0].value
    html = httpGet("http://lisa.com/results?q=" + q_value)
    renderHTML(html)
  }
}
browser.search.get()