export class Product {
constructor({ id, title, price, description }){
this.id = id; this.title = title; this.price = price; this.description = description;
}
}


export class ProductStore {
static #catalog = [
new Product({ id: "p1", title: "Loremsum", price: 14.99, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." }),
new Product({ id: "p2", title: "Ipsumlore", price: 24.00, description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem." }),
new Product({ id: "p3", title: "Dolorsit", price: 18.50, description: "At vero eos et accusamus et iusto odio dignissimos ducimus." }),
new Product({ id: "p4", title: "Sitdolor", price: 39.00, description: "Et harum quidem rerum facilis est et expedita distinctio." }),
new Product({ id: "p5", title: "Ametlore", price: 22.00, description: "Nam libero tempore, cum soluta nobis est eligendi optio cumque." }),
new Product({ id: "p6", title: "Consectu", price: 29.00, description: "Temporibus autem quibusdam et aut officiis debitis aut rerum." })

];


static all(){ return [...this.#catalog]; }
static byId(id){ return this.#catalog.find(p => p.id === id) || null; }
static random(n=3){
const arr = this.all();
for(let i=arr.length-1;i>0;i--){ const j = Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]]; }
return arr.slice(0, n);
}
}


export const money = (n) => `$${n.toFixed(2)}`;


const KEY = "hst_cart";
export function readCart(){
try { return JSON.parse(localStorage.getItem(KEY)) || { items: [] }; }
catch { return { items: [] }; }
}
export function writeCart(cart){ localStorage.setItem(KEY, JSON.stringify(cart)); }
export function addItem(id, qty=1){
const cart = readCart();
const line = cart.items.find(i => i.id === id);
if(line) line.qty += qty; else cart.items.push({ id, qty });
writeCart(cart);
return cart;
}
export function setQty(id, qty){
const cart = readCart();
const line = cart.items.find(i => i.id === id);
if(line){ line.qty = Math.max(1, qty); writeCart(cart); }
return cart;
}
export function removeItem(id){
const cart = readCart();
cart.items = cart.items.filter(i => i.id !== id);
writeCart(cart);
return cart;
}
export function countItems(){
const cart = readCart();
return cart.items.reduce((a,i)=>a+i.qty,0);
}