//Create variables here
var dog, dogImg, happyDog, database, foodS, foodStock;
var feed, addFood;
var fedTime, lastFed;
var foodObj;

function preload()
{
  //load images here
  dogImg = loadImage("dogImg.png");
  happyDog = loadImage("dogImg1.png");

}

function setup() {
  database = firebase.database();
  createCanvas(1000, 500);

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);
  
  dog = createSprite(800,220,150,150);
  dog.addImage(dogImg)
  dog.scale = 0.15

  feed = createButton("Feed the Dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  foodObj = new Food();
  
}


function draw() {  
  background(46,139,87);

  foodObj.display();

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed = data.val();
  })

  fill(255);
  textSize(20);
  if(lastFed >= 12){
    text("Last Feed : " + lastFed % 12 + " PM", 350, 30);
  }else if(lastFed == 0){
    text("Last Feed : 12 AM",350, 30);
  }else{
    text("Last Feed : " + lastFed + " AM", 350, 30);
  }

  
  drawSprites();

}



function feedDog(){
  dog.addImage(happyDog);
  foodObj.updateFoodStock(foodObj.getFoodStock()- 1)
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    FeedTime: hour()
  })
}

function addFoods(){
  foodS ++;
  database.ref('/').update({
  Food: foodS
  })  
}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}