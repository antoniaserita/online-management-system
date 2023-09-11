const courseList = document.getElementById('courseList'); 
const cartItemsList = document.querySelector('.cart-items'); 
const formsContainer = document.getElementById('formsContainer'); 

let cart = []; 
let courseData; 

// Logic to fetch course data from server
async function fetchCourseData() {
    try {
        const response = await fetch('http://localhost:3000/courses'); 
        courseData = await response.json(); 

        renderCourseList(courseData);
        updateCartUI(); 
    } catch (error) {
        console.error('Error fetching course data:', error); 
    }
}

// Logic to render the list of courses
function renderCourseList(courseData) {
    courseList.innerHTML = ''; 
    courseData.forEach(course => {
        const courseDiv = document.createElement('div'); 
        courseDiv.classList.add('course'); 
        courseDiv.innerHTML = `
            <img src="${course.image}" alt="${course.title}" class="course-image">
            <h3>${course.title}</h3>
            <h5>${course.author}</h5>
            <p>$${course.price.toFixed(2)}</p>
            <button class="add-to-cart" onclick="addToCart(${course.id})">Add to Cart</button>
        `; 
        courseList.appendChild(courseDiv); 
    });
}

// Logic to add a course to the cart
async function addToCart(id) {
    const selectedCourse = courseData.find(course => course.id === id); 
    if (selectedCourse) {
        cart.push(selectedCourse); 
        await updateCartOnServer(selectedCourse); 
        updateCartUI(); 
    }
}

// Logic to remove a course from the cart
async function removeFromCart(courseId) {
    cart = cart.filter(course => course.id !== courseId); 
    await updateCartOnServer(cart); 
    updateCartUI(); 
}

// Logic to update the cart UI
async function updateCartUI() {
    try {
        const response = await fetch('http://localhost:3000/cart'); 
        cart = await response.json(); 
        cartItemsList.innerHTML = ''; 
        cart.forEach(item => {
            if (item && item.price !== undefined) {
                const cartItem = document.createElement('li'); 
                cartItem.innerHTML = `
                    ${item.title} - $${item.price.toFixed(2)}
                    <button class="remove-from-cart" onclick="deleteFromCart(${item.id})">Remove</button>
                `; 
                cartItemsList.appendChild(cartItem); 
            }
        });
    } catch (error) {
        console.error('Error updating cart UI:', error);
    }
}

// Logic to update cart data on the server
async function updateCartOnServer(updatedCart) {
    const { id, ...product } = updatedCart; 
    try {
        await fetch('http://localhost:3000/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(product), 
        });
    } catch (error) {
        console.error('Error updating cart on server:', error); 
    }
}

// Logic to delete an item from the cart on the server
async function deleteFromCart(id) {
    try {
        await fetch(`http://localhost:3000/cart/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });
    } catch (error) {
        console.error('Error deleting item from cart on server:', error); 
    }
}

// Logic to toggle the display of a form
function toggleForm(formId) {
    var form = document.getElementById(formId); 
    if (form.style.display === "none") {
        form.style.display = "block"; 
    } else {
        form.style.display = "none"; 
    }
}

// Logic to hide a form
function hideForm(formId) {
    document.getElementById(formId).style.display = "none"; 
}

// Logic to handle user login
function loginUser() {
    var username = document.getElementById("loginUsername").value; 
    var password = document.getElementById("loginPassword").value; 
    alert("Logged in as " + username); 
    return false; 
}

// Logic to handle user registration
function registerUser() {
    var username = document.getElementById("registerUsername").value; 
    var password = document.getElementById("registerPassword").value; 
    alert("Registered as " + username); 
    return false; 
}

fetchCourseData(); 

