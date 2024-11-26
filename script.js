// Import Firebase modules at the very beginning of the file
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, set, push, get, child, update } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB8Uip-oZIRo0x3KN-MegkKOEgoxNAVNPA",
  authDomain: "consensus-eafbe.firebaseapp.com",
  databaseURL: "https://consensus-eafbe-default-rtdb.firebaseio.com",
  projectId: "consensus-eafbe",
  storageBucket: "consensus-eafbe.firebasestorage.app",
  messagingSenderId: "474883699812",
  appId: "1:474883699812:web:80531c2a6e8db7ad281b71"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let signupbtn = document.getElementById("signupbtn");
let signinbtn = document.getElementById("signinbtn");
let namefield = document.getElementById("namefield");
let title = document.getElementById("title");
let Continue = document.getElementById("continue");
let signUpMode = true;
let infoFill = false;
let infoLength = false;
let warningBox = document.getElementById("warning");
let accounts = [];


toggleVisibility("voting",false,true);
toggleVisibility("results",false,true);

function loadAccountsFromFirebase() {
  const accountsRef = ref(db, 'accounts');
  
  // Retrieve data from Firebase
  get(accountsRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        // Loop through the snapshot and extract data
        accounts = [];
        snapshot.forEach(childSnapshot => {
          let account = childSnapshot.val();
          accounts.push(account);
        });
        console.log("Accounts loaded: ", accounts);
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error("Error fetching accounts: ", error);
    });
}

loadAccountsFromFirebase();

function validateForm(){
  let name = document.getElementById("name").value.trim();
  let username = document.getElementById("username").value.trim();
  let password = document.getElementById("password").value.trim();
  if (signUpMode){
    if (name && username && password) {
      // Enable the button
      infoFill = true;
      if (username.length>4 && password.length>4){
        Continue.classList.remove("disable");
        infoLength = true;
      }
      else{
        Continue.classList.add("disable");
        infoLength = false;
      }
      
    } else {
      // Disable the button
      Continue.classList.add("disable");
      infoFill = false;
  }
}
  else{
    if (username && password) {
      // Enable the button
      
      infoFill = true;
      if (username.length>4 && password.length>4){
        Continue.classList.remove("disable");
        infoLength = true;
      }
      else{
        Continue.classList.add("disable");
        infoLength = false;
      }
    } else {
      // Disable the button
      Continue.classList.add("disable");
      infoFill = false;
    }
  }
}

document.getElementById("name").addEventListener("input", validateForm);
document.getElementById("username").addEventListener("input", validateForm);
document.getElementById("password").addEventListener("input", validateForm);

signinbtn.onclick = function(){
  signUpMode = false;
  namefield.style.maxHeight = "0";
  title.innerHTML = "Sign In";
  signupbtn.classList.add("disable");
  signinbtn.classList.remove("disable");
  validateForm();
   }
signupbtn.onclick = function(){
  signUpMode = true;
  namefield.style.maxHeight = "60px";
  title.innerHTML = "Sign Up";
  signinbtn.classList.add("disable");
  signupbtn.classList.remove("disable");
  validateForm();
  }  



Continue.onclick = function(){
  if (infoLength){
  const account = {
    username: document.getElementById("username").value.trim(),
    password: document.getElementById("password").value.trim()
  };
  if (signUpMode){
    account.name = document.getElementById("name").value.trim();
  }
  console.log(account);
  const accountExists = accounts.find(existingAccount => 
    existingAccount.username === account.username && existingAccount.password === account.password
  );
 
  const usernameExists = accounts.some(existingAccount => 
    existingAccount.username === account.username
  );
  const passwordExists = accounts.some(existingAccount => 
    existingAccount.password === account.password
  );
  
  if (signUpMode){
    if(usernameExists){
      console.log("Usename Already Taken");
      warningBox.innerHTML="Username Already Taken!";
      warningBox.classList.remove('hidden');
    }
    else if(passwordExists){
      console.log("Password Already Taken");
      warningBox.innerHTML="Password Already Taken!";
      warningBox.classList.remove('hidden');
    }
    if(!usernameExists&&!passwordExists){
      accounts.push(account);
      let tooltip = document.getElementById("profiletooltip");
      tooltip.innerHTML = account.name;
      console.log("Success! Account Created!");
      pushToFirebase(account);
      toggleVisibility("homepage",false,false);
      toggleVisibility("voting",true,false);
    }
  }
  else{
    if(accountExists){
      console.log("Success! Logged in!");
      let tooltip = document.getElementById("profiletooltip");
      tooltip.innerHTML = accountExists.name;
      toggleVisibility("homepage",false,false);
      toggleVisibility("voting",true,false);
    }
    else{
      console.log("Account Not Found");
      warningBox.innerHTML="Account Not Found!";
      warningBox.classList.remove('hidden');
    }
  }
}
else{
  if (infoFill){
    warningBox.innerHTML="Username And Password Must Be Longer";
    warningBox.classList.remove('hidden');
  }
  else{
    warningBox.innerHTML="Please Enter Info";
    warningBox.classList.remove('hidden');
  }
 
}
}

function toggleVisibility(className, show, remove) {
  document.querySelectorAll(`.${className}`).forEach(element => {
    element.classList.remove('hidden-disappear');
    if (show) {
      // Make visible
      element.classList.remove('hidden');
      element.classList.add('visible');
    } else {
      // Start fade-out
      element.classList.remove('visible');
      element.classList.add('hidden');
      
      if (remove) {
        // Delay adding 'hidden-disappear' until after fade-out transition
        setTimeout(() => {
          element.classList.add('hidden-disappear');
        }, 500); // Match your CSS transition time
      }
    }
  });
}







// Firebase push function to add an account to Firebase
function pushToFirebase(account) {
  const accountsRef = ref(db, 'accounts');
  push(accountsRef, account)
    .then(() => {
      console.log("Account added to Firebase successfully!");
    })
    .catch((error) => {
      console.error("Error adding account to Firebase:", error);
    });
}

const questions = [
    {
      id: "hotter-margot-or-mila",
      question: "Who's Hotter?",
      choice1: "Margot Robbie",
      choice2: "Mila Kunis",
      votes1: 0,
      votes2: 0,
      theme: "celebrity"
    },
    {
      id: "hotter-chris-evans-or-chris-hemsworth",
      question: "Who's Hotter?",
      choice1: "Chris Evans",
      choice2: "Chris Hemsworth",
      votes1: 0,
      votes2: 0,
      theme: "celebrity"
    },
    {
      id: "hotter-beyonce-or-rihanna",
      question: "Who's Hotter?",
      choice1: "Beyoncé",
      choice2: "Rihanna",
      votes1: 0,
      votes2: 0,
      theme: "celebrity"
    },
    {
      id: "hotter-zac-efron-or-ryan-gosling",
      question: "Who's Hotter?",
      choice1: "Zac Efron",
      choice2: "Ryan Gosling",
      votes1: 0,
      votes2: 0,
      theme: "celebrity"
    },
    {
      id: "hotter-jennifer-aniston-or-scarlett-johansson",
      question: "Who's Hotter?",
      choice1: "Jennifer Aniston",
      choice2: "Scarlett Johansson",
      votes1: 0,
      votes2: 0,
      theme: "celebrity"
    },
    {
      id: "hotter-tom-hardy-or-idris-elba",
      question: "Who's Hotter?",
      choice1: "Tom Hardy",
      choice2: "Idris Elba",
      votes1: 0,
      votes2: 0,
      theme: "celebrity"
    },
    {
      id: "hotter-kim-kardashian-or-kylie-jenner",
      question: "Who's Hotter?",
      choice1: "Kim Kardashian",
      choice2: "Kylie Jenner",
      votes1: 0,
      votes2: 0,
      theme: "celebrity"
    },
    {
      id: "hotter-emma-stone-or-emma-watson",
      question: "Who's Hotter?",
      choice1: "Emma Stone",
      choice2: "Emma Watson",
      votes1: 0,
      votes2: 0,
      theme: "celebrity"
    },
    {
      id: "hotter-leonardo-dicaprio-or-brad-pitt",
      question: "Who's Hotter?",
      choice1: "Leonardo DiCaprio",
      choice2: "Brad Pitt",
      votes1: 0,
      votes2: 0,
      theme: "celebrity"
    },
    {
      id: "hotter-kendall-jenner-or-gigi-hadid",
      question: "Who's Hotter?",
      choice1: "Kendall Jenner",
      choice2: "Gigi Hadid",
      votes1: 0,
      votes2: 0,
      theme: "celebrity"
    },
  
    // **Drinking & Partying Theme**
    {
      id: "shots-or-chug",
      question: "Shots or Chug?",
      choice1: "Shots",
      choice2: "Chug",
      votes1: 0,
      votes2: 0,
      theme: "drinking"
    },
    {
      id: "beer-or-wine",
      question: "Beer or Wine?",
      choice1: "Beer",
      choice2: "Wine",
      votes1: 0,
      votes2: 0,
      theme: "drinking"
    },
    {
      id: "pre-game-or-post-game",
      question: "Pre-game or Post-game?",
      choice1: "Pre-game",
      choice2: "Post-game",
      votes1: 0,
      votes2: 0,
      theme: "drinking"
    },
    {
      id: "drunk-dial-or-sober-text",
      question: "Drunk Dial or Sober Text?",
      choice1: "Drunk Dial",
      choice2: "Sober Text",
      votes1: 0,
      votes2: 0,
      theme: "drinking"
    },
    {
      id: "dorm-party-or-house-party",
      question: "Dorm Party or House Party?",
      choice1: "Dorm Party",
      choice2: "House Party",
      votes1: 0,
      votes2: 0,
      theme: "drinking"
    },
  
    // **Relationship & Love Theme**
    {
      id: "friends-with-benefits-or-serious-relationship",
      question: "Friends with Benefits or Serious Relationship?",
      choice1: "Friends with Benefits",
      choice2: "Serious Relationship",
      votes1: 0,
      votes2: 0,
      theme: "relationship"
    },
    {
      id: "online-dating-or-meet-cute",
      question: "Online Dating or Meet Cute?",
      choice1: "Online Dating",
      choice2: "Meet Cute",
      votes1: 0,
      votes2: 0,
      theme: "relationship"
    },
    {
      id: "cheat-or-be-cheated-on",
      question: "Cheat or Be Cheated On?",
      choice1: "Cheat",
      choice2: "Be Cheated On",
      votes1: 0,
      votes2: 0,
      theme: "relationship"
    },
    {
      id: "casual-hookup-or-commitment",
      question: "Casual Hookup or Commitment?",
      choice1: "Casual Hookup",
      choice2: "Commitment",
      votes1: 0,
      votes2: 0,
      theme: "relationship"
    },
    {
      id: "make-up-sex-or-fight",
      question: "Make-up Sex or Fight?",
      choice1: "Make-up Sex",
      choice2: "Fight",
      votes1: 0,
      votes2: 0,
      theme: "relationship"
    },
  
    // **Sex & Kinks Theme**
    {
      id: "kinky-or-vanilla",
      question: "Kinky or Vanilla?",
      choice1: "Kinky",
      choice2: "Vanilla",
      votes1: 0,
      votes2: 0,
      theme: "sex"
    },
    {
      id: "strip-club-or-boudoir",
      question: "Strip Club or Boudoir?",
      choice1: "Strip Club",
      choice2: "Boudoir",
      votes1: 0,
      votes2: 0,
      theme: "sex"
    },
    {
      id: "quickie-or-marathon",
      question: "Quickie or Marathon?",
      choice1: "Quickie",
      choice2: "Marathon",
      votes1: 0,
      votes2: 0,
      theme: "sex"
    },
    {
      id: "casual-sex-or-relationship",
      question: "Casual Sex or Relationship?",
      choice1: "Casual Sex",
      choice2: "Relationship",
      votes1: 0,
      votes2: 0,
      theme: "sex"
    },
    {
      id: "sex-toy-or-no-toy",
      question: "Sex Toy or No Toy?",
      choice1: "Sex Toy",
      choice2: "No Toy",
      votes1: 0,
      votes2: 0,
      theme: "sex"
    },
  
    // **College Life Theme**
    {
      id: "skip-class-or-show-up-late",
      question: "Skip Class or Show Up Late?",
      choice1: "Skip Class",
      choice2: "Show Up Late",
      votes1: 0,
      votes2: 0,
      theme: "college life"
    },
    {
      id: "coffee-or-energy-drink",
      question: "Coffee or Energy Drink?",
      choice1: "Coffee",
      choice2: "Energy Drink",
      votes1: 0,
      votes2: 0,
      theme: "college life"
    },
    {
      id: "party-with-friends-or-alone",
      question: "Party with Friends or Alone?",
      choice1: "With Friends",
      choice2: "Alone",
      votes1: 0,
      votes2: 0,
      theme: "college life"
    },
    {
      id: "pull-an-all-nighter-or-sleep-in",
      question: "Pull an All Nighter or Sleep In?",
      choice1: "All Nighter",
      choice2: "Sleep In",
      votes1: 0,
      votes2: 0,
      theme: "college life"
    },
    {
      id: "dorm-food-or-takeout",
      question: "Dorm Food or Takeout?",
      choice1: "Dorm Food",
      choice2: "Takeout",
      votes1: 0,
      votes2: 0,
      theme: "college life"
    },
  
    // **Life Choices Theme**
    {
      id: "no-regrets-or-regrets",
      question: "No Regrets or Regrets?",
      choice1: "No Regrets",
      choice2: "Regrets",
      votes1: 0,
      votes2: 0,
      theme: "life choices"
    },
    {
      id: "spend-now-or-save",
      question: "Spend Now or Save?",
      choice1: "Spend Now",
      choice2: "Save",
      votes1: 0,
      votes2: 0,
      theme: "life choices"
    },
    {
      id: "life-of-party-or-quiet-life",
      question: "Life of the Party or Quiet Life?",
      choice1: "Life of the Party",
      choice2: "Quiet Life",
      votes1: 0,
      votes2: 0,
      theme: "life choices"
    },
    {
      id: "reality-or-escape",
      question: "Reality or Escape?",
      choice1: "Reality",
      choice2: "Escape",
      votes1: 0,
      votes2: 0,
      theme: "life choices"
    },
    {
      id: "money-or-freedom",
      question: "Money or Freedom?",
      choice1: "Money",
      choice2: "Freedom",
      votes1: 0,
      votes2: 0,
      theme: "life choices"
    },
  
    // **Food Theme**
    {
      id: "junk-food-or-healthy",
      question: "Junk Food or Healthy?",
      choice1: "Junk Food",
      choice2: "Healthy",
      votes1: 0,
      votes2: 0,
      theme: "food"
    },
    {
      id: "spicy-food-or-bland",
      question: "Spicy Food or Bland?",
      choice1: "Spicy",
      choice2: "Bland",
      votes1: 0,
      votes2: 0,
      theme: "food"
    },
    {
      id: "mukbang-or-small-bites",
      question: "Mukbang or Small Bites?",
      choice1: "Mukbang",
      choice2: "Small Bites",
      votes1: 0,
      votes2: 0,
      theme: "food"
    },
    {
      id: "alcohol-with-meal-or-none",
      question: "Alcohol with Meal or None?",
      choice1: "Alcohol",
      choice2: "None",
      votes1: 0,
      votes2: 0,
      theme: "food"
    },
    {
      id: "pizza-or-burger",
      question: "Pizza or Burger?",
      choice1: "Pizza",
      choice2: "Burger",
      votes1: 0,
      votes2: 0,
      theme: "food"
    },
  
  
  // **Food Theme**
  {
    id: "best-pizza-topping",
    question: "Best Pizza Topping?",
    choice1: "Pepperoni",
    choice2: "Pineapple",
    votes1: 0,
    votes2: 0,
    theme: "food"
  },
  {
    id: "hotdog-condiment",
    question: "Best Hotdog Condiment?",
    choice1: "Ketchup",
    choice2: "Mustard",
    votes1: 0,
    votes2: 0,
    theme: "food"
  },
  {
    id: "nachos-topping",
    question: "Best Nacho Topping?",
    choice1: "Cheese",
    choice2: "Guacamole",
    votes1: 0,
    votes2: 0,
    theme: "food"
  },
  {
    id: "spicy-foods",
    question: "Spiciest Food You've Eaten?",
    choice1: "Hot Wings",
    choice2: "Salsa",
    votes1: 0,
    votes2: 0,
    theme: "food"
  },
  {
    id: "fast-food-1am",
    question: "Best Fast Food for 1AM?",
    choice1: "McDonald's",
    choice2: "Taco Bell",
    votes1: 0,
    votes2: 0,
    theme: "food"
  },
  {
    id: "study-snacks",
    question: "Best Study Snack?",
    choice1: "Chips",
    choice2: "Candy",
    votes1: 0,
    votes2: 0,
    theme: "food"
  },
  {
    id: "instant-noodles",
    question: "Top Instant Noodles Brand?",
    choice1: "Ramen",
    choice2: "Cup Noodles",
    votes1: 0,
    votes2: 0,
    theme: "food"
  },
  {
    id: "beer-vs-liquor",
    question: "Beer or Liquor?",
    choice1: "Beer",
    choice2: "Liquor",
    votes1: 0,
    votes2: 0,
    theme: "food"
  },
  {
    id: "morning-coffee",
    question: "Morning Coffee or Energy Drink?",
    choice1: "Coffee",
    choice2: "Energy Drink",
    votes1: 0,
    votes2: 0,
    theme: "food"
  },
  {
    id: "dinner-date",
    question: "Best Date Night Dinner?",
    choice1: "Steak",
    choice2: "Sushi",
    votes1: 0,
    votes2: 0,
    theme: "food"
  },

  // **Personal Theme**
  {
    id: "cheat-or-be-cheated",
    question: "Would you rather cheat or be cheated on?",
    choice1: "Cheat",
    choice2: "Be Cheated On",
    votes1: 0,
    votes2: 0,
    theme: "personal"
  },
  {
    id: "condom-or-no-condom",
    question: "Condom or No Condom?",
    choice1: "Condom",
    choice2: "No Condom",
    votes1: 0,
    votes2: 0,
    theme: "personal"
  },
  {
    id: "one-night-stand",
    question: "One Night Stand or Long-Term Relationship?",
    choice1: "One Night Stand",
    choice2: "Long-Term Relationship",
    votes1: 0,
    votes2: 0,
    theme: "personal"
  },
  {
    id: "public-or-private",
    question: "Public or Private Sex?",
    choice1: "Public",
    choice2: "Private",
    votes1: 0,
    votes2: 0,
    theme: "personal"
  },
  {
    id: "drunk-text",
    question: "Drunk Text Your Ex or Ignore Them?",
    choice1: "Drunk Text",
    choice2: "Ignore",
    votes1: 0,
    votes2: 0,
    theme: "personal"
  },
  {
    id: "fake-it-or-leave-it",
    question: "Fake It or Leave It?",
    choice1: "Fake It",
    choice2: "Leave It",
    votes1: 0,
    votes2: 0,
    theme: "personal"
  },
  {
    id: "shower-before-or-after",
    question: "Shower Before or After Sex?",
    choice1: "Before",
    choice2: "After",
    votes1: 0,
    votes2: 0,
    theme: "personal"
  },
  {
    id: "friendzone-or-more",
    question: "Friendzone or Try for More?",
    choice1: "Friendzone",
    choice2: "Try for More",
    votes1: 0,
    votes2: 0,
    theme: "personal"
  },
  {
    id: "hookup-or-relationship",
    question: "Hookup or Relationship?",
    choice1: "Hookup",
    choice2: "Relationship",
    votes1: 0,
    votes2: 0,
    theme: "personal"
  },
  {
    id: "sex-or-sleep",
    question: "Sex or Sleep?",
    choice1: "Sex",
    choice2: "Sleep",
    votes1: 0,
    votes2: 0,
    theme: "personal"
  },

  // **College Life Theme**
  {
    id: "skip-class-or-study",
    question: "Skip Class or Study?",
    choice1: "Skip Class",
    choice2: "Study",
    votes1: 0,
    votes2: 0,
    theme: "college"
  },
  {
    id: "all-nighter-or-sleep",
    question: "All Nighter or Get Some Sleep?",
    choice1: "All Nighter",
    choice2: "Get Some Sleep",
    votes1: 0,
    votes2: 0,
    theme: "college"
  },
  {
    id: "study-party-or-hangout",
    question: "Study, Party, or Hangout?",
    choice1: "Study",
    choice2: "Party",
    votes1: 0,
    votes2: 0,
    theme: "college"
  },
  {
    id: "frat-or-sorority",
    question: "Frat or Sorority?",
    choice1: "Frat",
    choice2: "Sorority",
    votes1: 0,
    votes2: 0,
    theme: "college"
  },
  {
    id: "cheating-or-study-hard",
    question: "Cheat on a Test or Study Hard?",
    choice1: "Cheat",
    choice2: "Study Hard",
    votes1: 0,
    votes2: 0,
    theme: "college"
  },
  {
    id: "roommate-or-alone",
    question: "Roommate or Live Alone?",
    choice1: "Roommate",
    choice2: "Live Alone",
    votes1: 0,
    votes2: 0,
    theme: "college"
  },
  {
    id: "late-night-essay-or-sleep",
    question: "Write a Late-Night Essay or Sleep?",
    choice1: "Essay",
    choice2: "Sleep",
    votes1: 0,
    votes2: 0,
    theme: "college"
  },
  {
    id: "lecture-or-lab",
    question: "Lecture or Lab?",
    choice1: "Lecture",
    choice2: "Lab",
    votes1: 0,
    votes2: 0,
    theme: "college"
  },
  {
    id: "study-group-or-alone",
    question: "Study Group or Alone?",
    choice1: "Study Group",
    choice2: "Alone",
    votes1: 0,
    votes2: 0,
    theme: "college"
  },
  {
    id: "free-food-or-savings",
    question: "Free Food or Save Money?",
    choice1: "Free Food",
    choice2: "Save Money",
    votes1: 0,
    votes2: 0,
    theme: "college"
  },

  // **Technology Theme**
  {
    id: "iphone-vs-android",
    question: "iPhone or Android?",
    choice1: "iPhone",
    choice2: "Android",
    votes1: 0,
    votes2: 0,
    theme: "technology"
  },
  {
    id: "tech-guru-or-casual-user",
    question: "Tech Guru or Casual User?",
    choice1: "Tech Guru",
    choice2: "Casual User",
    votes1: 0,
    votes2: 0,
    theme: "technology"
  },
  {
    id: "windows-vs-mac",
    question: "Windows or Mac?",
    choice1: "Windows",
    choice2: "Mac",
    votes1: 0,
    votes2: 0,
    theme: "technology"
  },
  {
    id: "apple-vs-google",
    question: "Apple or Google?",
    choice1: "Apple",
    choice2: "Google",
    votes1: 0,
    votes2: 0,
    theme: "technology"
  },
  {
    id: "online-shopping-or-store",
    question: "Online Shopping or Going to the Store?",
    choice1: "Online",
    choice2: "Store",
    votes1: 0,
    votes2: 0,
    theme: "technology"
  },
  {
    id: "social-media-or-quiet",
    question: "Social Media or Stay Quiet?",
    choice1: "Social Media",
    choice2: "Stay Quiet",
    votes1: 0,
    votes2: 0,
    theme: "technology"
  },
  {
    id: "google-vs-bing",
    question: "Google or Bing?",
    choice1: "Google",
    choice2: "Bing",
    votes1: 0,
    votes2: 0,
    theme: "technology"
  },
  {
    id: "ps5-vs-xbox",
    question: "PS5 or Xbox?",
    choice1: "PS5",
    choice2: "Xbox",
    votes1: 0,
    votes2: 0,
    theme: "technology"
  },
  {
    id: "macbook-vs-laptop",
    question: "MacBook or Laptop?",
    choice1: "MacBook",
    choice2: "Laptop",
    votes1: 0,
    votes2: 0,
    theme: "technology"
  },
  {
    id: "streaming-vs-cable",
    question: "Streaming or Cable TV?",
    choice1: "Streaming",
    choice2: "Cable TV",
    votes1: 0,
    votes2: 0,
    theme: "technology"
  },

  // **Music Theme**
  {
    id: "rap-vs-rock",
    question: "Rap or Rock?",
    choice1: "Rap",
    choice2: "Rock",
    votes1: 0,
    votes2: 0,
    theme: "music"
  },
  {
    id: "music-vs-noise",
    question: "Music or Silence?",
    choice1: "Music",
    choice2: "Silence",
    votes1: 0,
    votes2: 0,
    theme: "music"
  },
  {
    id: "club-music-or-relax",
    question: "Club Music or Relaxing Beats?",
    choice1: "Club Music",
    choice2: "Relaxing Beats",
    votes1: 0,
    votes2: 0,
    theme: "music"
  },
  {
    id: "concert-or-recording",
    question: "Concert or Recorded Music?",
    choice1: "Concert",
    choice2: "Recorded",
    votes1: 0,
    votes2: 0,
    theme: "music"
  },
  {
    id: "old-school-vs-modern",
    question: "Old School Music or Modern?",
    choice1: "Old School",
    choice2: "Modern",
    votes1: 0,
    votes2: 0,
    theme: "music"
  },
  {
    id: "playlist-vs-album",
    question: "Playlist or Full Album?",
    choice1: "Playlist",
    choice2: "Album",
    votes1: 0,
    votes2: 0,
    theme: "music"
  },
  {
    id: "drum-set-or-dj",
    question: "Drum Set or DJ?",
    choice1: "Drum Set",
    choice2: "DJ",
    votes1: 0,
    votes2: 0,
    theme: "music"
  },
  {
    id: "music-video-or-radio",
    question: "Music Video or Radio?",
    choice1: "Music Video",
    choice2: "Radio",
    votes1: 0,
    votes2: 0,
    theme: "music"
  },
  {
    id: "hip-hop-or-pop",
    question: "Hip-Hop or Pop?",
    choice1: "Hip-Hop",
    choice2: "Pop",
    votes1: 0,
    votes2: 0,
    theme: "music"
  },
  {
    id: "mashup-vs-original",
    question: "Mashup or Original Song?",
    choice1: "Mashup",
    choice2: "Original",
    votes1: 0,
    votes2: 0,
    theme: "music"
  },

  // **Movies Theme**
  {
    id: "action-vs-romance",
    question: "Action Movie or Romantic Comedy?",
    choice1: "Action",
    choice2: "Romantic Comedy",
    votes1: 0,
    votes2: 0,
    theme: "movies"
  },
  {
    id: "horror-vs-thriller",
    question: "Horror Movie or Thriller?",
    choice1: "Horror",
    choice2: "Thriller",
    votes1: 0,
    votes2: 0,
    theme: "movies"
  },
  {
    id: "marvel-vs-dc",
    question: "Marvel or DC?",
    choice1: "Marvel",
    choice2: "DC",
    votes1: 0,
    votes2: 0,
    theme: "movies"
  },
  {
    id: "animated-vs-real",
    question: "Animated Movie or Real-life Movie?",
    choice1: "Animated",
    choice2: "Real-life",
    votes1: 0,
    votes2: 0,
    theme: "movies"
  },
  {
    id: "superhero-vs-villain",
    question: "Superhero Movie or Villain Movie?",
    choice1: "Superhero",
    choice2: "Villain",
    votes1: 0,
    votes2: 0,
    theme: "movies"
  },
  {
    id: "comedy-vs-drama",
    question: "Comedy Movie or Drama?",
    choice1: "Comedy",
    choice2: "Drama",
    votes1: 0,
    votes2: 0,
    theme: "movies"
  },
  {
    id: "classic-vs-modern",
    question: "Classic Movie or Modern Blockbuster?",
    choice1: "Classic",
    choice2: "Modern",
    votes1: 0,
    votes2: 0,
    theme: "movies"
  },
  {
    id: "underrated-vs-overrated",
    question: "Underrated Movie or Overrated Movie?",
    choice1: "Underrated",
    choice2: "Overrated",
    votes1: 0,
    votes2: 0,
    theme: "movies"
  },
  {
    id: "netflix-vs-theater",
    question: "Netflix or Movie Theater?",
    choice1: "Netflix",
    choice2: "Movie Theater",
    votes1: 0,
    votes2: 0,
    theme: "movies"
  },
  {
    id: "blockbuster-or-indie",
    question: "Blockbuster or Indie Movie?",
    choice1: "Blockbuster",
    choice2: "Indie",
    votes1: 0,
    votes2: 0,
    theme: "movies"
  }
];

uploadQuestions();
function uploadQuestions() {
  const questionsRef = ref(db, 'questions');

  questions.forEach((q) => {
    const questionRef = ref(db, `questions/${q.id}`);
    
    // Check if the question already exists in Firebase
    get(questionRef).then((snapshot) => {
      if (!snapshot.exists()) {
        // If the question doesn't exist, upload it
        set(questionRef, {
          question: q.question,
          choice1: q.choice1,
          choice2: q.choice2,
          votes1: q.votes1,
          votes2: q.votes2,
          theme: q.theme
        }).then(() => {
          console.log(`Question "${q.id}" uploaded successfully!`);
        }).catch(error => {
          console.error(`Error uploading question "${q.id}":`, error);
        });
      } else {
        // If the question exists, log that it is skipped
        console.log(`Question "${q.id}" already exists, skipping upload.`);
      }
    }).catch(error => {
      console.error('Error checking question existence:', error);
    });
  });
}



const questionEl = document.getElementById("question");
const choice1El = document.getElementById("choice1Button");
const choice2El = document.getElementById("choice2Button");
const choice1ElNum = document.getElementById("choice1ButtonNum");
const choice2ElNum = document.getElementById("choice2ButtonNum");
const choice1ImageEl = document.getElementById("choice1Image");
const choice2ImageEl = document.getElementById("choice2Image");
let next = document.getElementById("nextquestionbtn");
let voted = false;
let allQuestions = [];


function getAllQuestionsFromFirebase() {
  allQuestions = [];
  const questionsRef = ref(db, 'questions');
  
  return new Promise((resolve, reject) => {
    get(questionsRef).then(snapshot => {
      if (snapshot.exists()) {
        
        snapshot.forEach(childSnapshot => {
          let question = childSnapshot.val();
          question.id = childSnapshot.key;  // Add the question ID from Firebase
          allQuestions.push(question);
        });
        
        resolve(allQuestions);  // Return the array of questions
      } else {
        reject('No questions found in Firebase.');
      }
    }).catch(error => {
      reject('Error fetching questions from Firebase: ' + error);
    });
  });
}

getAllQuestionsFromFirebase();

function loadRandomQuestion() {
  next.innerHTML = "Skip";
  next.style = "background-color: darkred;";
  voted = false;
  choice1ElNum.classList.add("hidden");
  choice2ElNum.classList.add("hidden");
  choice1El.classList.remove("darkgreen");
  choice2El.classList.remove("darkgreen");
  choice1El.classList.remove("darkred");
  choice2El.classList.remove("darkred");

  // Pick a random question from the array
  const randomIndex = Math.floor(Math.random() * allQuestions.length);
  const randomQuestion = allQuestions[randomIndex];

  // Update the UI with the random question
  questionEl.textContent = randomQuestion.question;
  choice1El.textContent = `${randomQuestion.choice1}`;
  // choice1ElNum.textContent = `(${((randomQuestion.votes1/(randomQuestion.votes1+randomQuestion.votes2))*100).toFixed(1) || 0}% votes)`;
  choice2El.textContent = `${randomQuestion.choice2}`;
  // choice2ElNum.textContent = `(${((randomQuestion.votes2/(randomQuestion.votes1+randomQuestion.votes2))*100).toFixed(1) || 0}% votes)`;

  getImageUrl(randomQuestion.choice1+" "+randomQuestion.theme)
    .then(url => {
      choice1ImageEl.src = url;
    })
    .catch(error => {
      console.error("Error fetching image for choice1:", error);
    });

  getImageUrl(randomQuestion.choice2+" "+randomQuestion.theme)
    .then(url => {
      choice2ImageEl.src = url;
    })
    .catch(error => {
      console.error("Error fetching image for choice2:", error);
    });

  // Attach click listeners for voting
  choice1El.onclick = () => {
    vote(randomQuestion.id, "votes1", randomQuestion);
  };

  choice2El.onclick = () => {
    vote(randomQuestion.id, "votes2", randomQuestion);
  };
}





getAllQuestionsFromFirebase()
  .then(() => {
    loadRandomQuestion();  // Now that questions are loaded, we can call this function
  })
  .catch(error => {
    console.error("Error loading questions:", error);
  });

next.addEventListener("click", function() {
  loadRandomQuestion();
});
function vote(questionId, voteKey, question) {
  if (!voted) {
    voted = true;
    console.log("Voting for question ID:", questionId);
    const questionRef = ref(db, `questions/${questionId}`);
    buttonAudio.play();
    // Fetch the current question data from Firebase
    get(questionRef).then(snapshot => {
      if (snapshot.exists()) {
        const currentVotes = snapshot.val()[voteKey] || 0; // Get current votes, defaulting to 0 if not set
        const updatedVotes = currentVotes + 1; // Increment the vote

        // Update the votes in Firebase
        const updates = {};
        updates[voteKey] = updatedVotes;

        update(questionRef, updates)
          .then(() => {
            console.log("Vote added successfully!");
            choice1ElNum.classList.remove("hidden");
            choice2ElNum.classList.remove("hidden");
            if (voteKey == "votes1") {
              choice1El.classList.add("darkgreen");
              choice2El.classList.add("darkred");
            } else {
              choice2El.classList.add("darkgreen");
              choice1El.classList.add("darkred");
            }

            // Fetch the updated data from Firebase to ensure accuracy
            get(questionRef).then(updatedSnapshot => {
              if (updatedSnapshot.exists()) {
                const updatedQuestion = updatedSnapshot.val();
                const totalVotes =
                  (updatedQuestion.votes1 || 0) + (updatedQuestion.votes2 || 0);

                // Update percentages and UI
                const finalper1 = (
                  (updatedQuestion.votes1 / totalVotes) *
                  100
                ).toFixed(1);
                const finalper2 = (
                  (updatedQuestion.votes2 / totalVotes) *
                  100
                ).toFixed(1);

                choice1El.textContent = `${updatedQuestion.choice1}`;
                choice2El.textContent = `${updatedQuestion.choice2}`;
                next.innerHTML = "Continue";
                next.style = "background-color: darkgreen;";

                // Animate percentages
                animatePercentage(choice1ElNum, finalper1);
                animatePercentage(choice2ElNum, finalper2);
              }
            });
          })
          .catch(error => console.error("Error adding vote:", error));
      } else {
        console.error("Error: Question not found!");
      }
    }).catch(error => {
      console.error("Error fetching question:", error);
    });
  } else {
    console.error("Already Voted!");
  }
}

// Helper function to animate percentages
function animatePercentage(element, targetPercentage) {
  let current = 0;
  const interval = setInterval(() => {
    element.textContent = `(${current.toFixed(1)}% votes)`;
    current += 0.1;
    if (current >= targetPercentage) {
      clearInterval(interval);
      element.textContent = `(${targetPercentage}% votes)`;
    }
  }, 2); // Adjust speed if needed
}


const buttonAudio = document.getElementById("buttonpressaudio");
// Function to cast a vote


const volumeIcon = document.getElementById('volume-icon');

// Set the initial state to volumeOff.png (ensure it's loaded initially)
volumeIcon.src = 'volumeOff.png';

// Add event listener for the click event
volumeIcon.addEventListener("click", function() {
  toggleVolume();
});
const audio = document.getElementById('backgroundMusic');

function toggleVolume() {
  // Check the source URL for the current image
  if (volumeIcon.src.endsWith('volumeOff.png')) {
    volumeIcon.src = 'volumeOn.png';  // Change to "volumeOn.png"
    audio.muted = false;
    buttonAudio.muted = false;
  } else {
    volumeIcon.src = 'volumeOff.png'; // Change back to "volumeOff.png"
    audio.muted = true;
    buttonAudio.muted = true;
  }
}

const switchPageButton = document.getElementById('switchpage');
switchPageButton.addEventListener('click', function() {
  // Call the toggleVisibility function when the button is clicked
  toggleVisibility('voting',false,true);
  toggleVisibility("homepage",false,true);
  toggleVisibility("results",true,false);
  getAllQuestionsFromFirebase()
  .then(() => {
    populateVotingGrid(allQuestions);  // Now that questions are loaded, we can call this function
  })
  .catch(error => {
    console.error("Error loading questions:", error);
  });
});
const votePageButton = document.getElementById('votingpagebutton');
votePageButton.addEventListener('click', function() {
  // Call the toggleVisibility function when the button is clicked
  toggleVisibility('voting',true,false);
  toggleVisibility("results",false,true);
  toggleVisibility("homepage",false,false);
});

const API_KEY = '47274282-036fd630b2d10478a5da24e96';
const BASE_URL = "https://pixabay.com/api/";

// Function to fetch an image URL based on search term using fetch() (no jQuery needed)
function getImageUrl(query) {
  const URL = `${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(query)}&image_type=photo`;

  console.log('Request URL:', URL); // Check the URL

  return new Promise((resolve, reject) => {
    fetch(URL)
      .then(response => {
        if (!response.ok) {
          reject(`Failed to fetch from Pixabay. Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (parseInt(data.totalHits) > 0) {
          // Directly accessing the first result
          const imageUrl = data.hits[0].webformatURL;
          resolve(imageUrl); // Return the image URL
        } else {
          reject('No hits found for your query');
        }
      })
      .catch(error => {
        reject('Error fetching data from Pixabay API: ' + error);
      });
  });
}
const votingGrid = document.querySelector(".voting-grid");
let searchBar = document.getElementById("resultssearchbar");
searchBar.addEventListener("input", filterQuestions);
function filterQuestions() {
  const searchTerm = searchBar.value.toLowerCase();  // Get search term and make it lowercase

  // Filter the questions array based on whether the question starts with the search term
  const filteredQuestions = allQuestions.filter(question => 
    question.question.toLowerCase().startsWith(searchTerm)
  );

  // Clear the current displayed grid
  votingGrid.innerHTML = "";

  // Re-populate the grid with the filtered questions
  populateVotingGrid(filteredQuestions);
}
// Function to create and append infoboxes
function populateVotingGrid(questionList) {
  questionList.forEach(question => {
    // Create the infobox container
    const infobox = document.createElement("div");
    infobox.classList.add("infobox");

    // Add the title of the question (in bold)
    const questionTitle = document.createElement("h2");
    questionTitle.classList.add("question-title");
    questionTitle.textContent = question.question; // Use the question text
    infobox.appendChild(questionTitle); // Add the title above the image

    // Add the image
    const img = document.createElement("img");
    if(question.votes1>=question.votes2){
      getImageUrl(question.choice1+" "+question.theme)
      .then(url => {
        img.src = url;
      })
      .catch(error => {
        console.error("Error fetching image for img:", error);
      });
    }
    else{
      getImageUrl(question.choice2+" "+question.theme)
      .then(url => {
        img.src = url;
      })
      .catch(error => {
        console.error("Error fetching image for img:", error);
      });
    }
    
    img.alt = question.question;
    infobox.appendChild(img);

    // Create a container for the bars (with equal maximum width)
    const barContainer = document.createElement("div");
    barContainer.classList.add("vote-bar-container");

    // Create vote bars for both choices
    const choice1Bar = document.createElement("div");
    const choice2Bar = document.createElement("div");

    // Calculate the percentage of votes for each choice
    const totalVotes = question.votes1 + question.votes2;
    const choice1Percentage = totalVotes ? (question.votes1 / totalVotes) * 100 : 0;
    const choice2Percentage = totalVotes ? (question.votes2 / totalVotes) * 100 : 0;

    // Set both bars' width based on the percentage of votes, while keeping them in the same container width
    choice1Bar.style.width = `${choice1Percentage}%`;
    choice2Bar.style.width = `${choice2Percentage}%`;

    // Add classes to the bars and set their background colors
    choice1Bar.classList.add("vote-bar");
    choice2Bar.classList.add("vote-bar");
    if(question.votes1 > question.votes2) {
      choice1Bar.style.backgroundColor = "#4caf50";
      choice2Bar.style.backgroundColor = "#f44336";
    }
    else if(question.votes2 > question.votes1) {
      choice1Bar.style.backgroundColor = "#f44336";
      choice2Bar.style.backgroundColor = "#4caf50";
    }
    else {
      choice1Bar.style.backgroundColor = "#f7c300";
      choice2Bar.style.backgroundColor = "#f7c300";
    } 

    // Add the text labels
    const choice1Text = document.createElement("span");
    choice1Text.classList.add("vote-text");
    choice1Text.textContent = `${question.choice1}: ${question.votes1} Votes`;

    const choice2Text = document.createElement("span");
    choice2Text.classList.add("vote-text");
    choice2Text.textContent = `${question.choice2}: ${question.votes2} Votes`;

    // Create containers for each choice and vote text
    const choice1Container = document.createElement("div");
    choice1Container.classList.add("vote-container");
    choice1Container.appendChild(choice1Bar);
    choice1Container.appendChild(choice1Text);

    const choice2Container = document.createElement("div");
    choice2Container.classList.add("vote-container");
    choice2Container.appendChild(choice2Bar);
    choice2Container.appendChild(choice2Text);

    // Append the choice containers to the infobox
    infobox.appendChild(choice1Container);
    infobox.appendChild(choice2Container);

    // Append the infobox to the grid
    votingGrid.appendChild(infobox);
  });
}


