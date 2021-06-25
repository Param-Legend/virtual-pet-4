//Create variables here
var dog,sadDog,happyDog,garden,washroom, database;
var foodS,foodStock;
var fedTime,lastFed,currentTime;
var feed,addFood;
var foodObj;
var gameState,readState;
var bg

function preload(){
sadDog=loadImage("D2.png");
happyDog=loadImage("D.png");
garden=loadImage("images.jpeg");
washroom=loadImage("Wc.jpeg");
bedroom=loadImage("d.jpeg");
bg = loadImage("Wow.jpeg")
}

function setup() {
  database=firebase.database();
  createCanvas(600,500);
  
  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  //read game state from database
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });
   
  dog=createSprite(400,400,150,150);
  dog.addImage(sadDog);
  dog.scale=0.28;
  
  feed=createButton("Feed the dog");
  feed.visible = false
  feed.position(400,95);
  feed.style("background-color","cyan")
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.hide()
  addFood.style("background-color","lightgreen")
  addFood.mousePressed(addFoods);
}

function draw() {
  background(bg);
  //writeStock()
  currentTime=hour()

  if(foodS == 0){
dog.addImage(happyDog)
foodObj.visible=false

  }
  else{
dog.addImage(sadDog)
foodObj.visible = true

  }
  if(currentTime==(lastFed+1)){
      update(5);
      foodObj.garden();
   }else if(currentTime==(lastFed+2)){
    update(4);
      foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update(3);
      foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
   }
   
   if(gameState!="Hungry"){
     feed.hide();
     addFood.hide();
     dog.remove();
   }else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
   }
 if(gameState===1){
dog.addImage(happyDog)
dog.scale = 0.175
dog.y= 250

 }
 if(gameState===2){
   dog.addImage(sadDog)
   dog.scale=0.175
   foodObj.visible = false
 }
 var Bath = createButton("I want to take bath")
Bath.position(580,125)
if(Bath.mousePressed(function(){
gameState=3
dog.addImage(washroom);
database.ref('/').update({'gameState':gameState});

}));
if(gameState===3){

dog.addImage(washroom);
dog.scale=1;
foodObj.visible = false;

}
var sleep = createButton("I am Very sleepy")
sleep.position(710,125);
if(sleep.mousePressed(function(){

gameState=4;
database.ref('/').update({'gameState':gameState})

}))
if(gameState===4){
dog.addImage(bedroom)
dog.scale=1
foodObj.visible = false;

}
var play = createButton("Lets play !!")
play.position(500,160);
if(play.mousePressed(function(){

gameState=5;
database.ref('/').update({'gameState':gameState})

}))
if(gameState===5){
dog.addImage(bg)
dog.scale=1
foodObj.visible = false;

}
var playIn = createButton("Lets play in park")
playIn.position(585,160);
if(playIn.mousePressed(function(){

gameState=6;
database.ref('/').update({'gameState':gameState})

}))
if(gameState===6){
dog.addImage(bg)
dog.scale=1
foodObj.visible = false;

}



 
  drawSprites();
  fill("white")
  text("Note : You have to take care of your pet",300,20)
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}
function writeStock(x){

database.ref('/').update({

'Food':x

})





}


//function to update food stock and last fed time
function feedDog(){
  dog.changeImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

//update gameState
function update(state){
  database.ref('/').update({
    gameState:state
  })
}
