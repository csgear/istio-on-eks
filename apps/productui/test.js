let obj1 = {
    'Content-Type': 'application/json'
}

let obj2 =  {
    'x-tenant': 'test-user'
}

let obj = {
    ...obj1, ...obj2
}

console.log(obj)