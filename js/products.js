export class Product {
constructor({ id, title, price, description }){
this.id = id; this.title = title; this.price = price; this.description = description;
}
}


export class ProductStore {
static #catalog = [
new Product({ id: "p1", title: "Lorem Mug", price: 14.99, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." }),
new Product({ id: "p2", title: "Ipsum Tee", price: 24.00, description: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." }),
new Product({ id: "p3", title: "Dolor Journal", price: 18.50, description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris." }),
new Product({ id: "p4", title: "Sit Kit", price: 39.00, description: "Nisi ut aliquip ex ea commodo consequat." }),
new Product({ id: "p5", title: "Amet Tote", price: 22.00, description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum." }),
new Product({ id: "p6", title: "Consectetur Sampler", price: 29.00, description: "Excepteur sint occaecat cupidatat non proident, sunt in culpa." }),

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


// Lightweight LocalStorage cart helpers
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