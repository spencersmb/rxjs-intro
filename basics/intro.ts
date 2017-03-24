import { Observer, Observable } from 'rxjs';

//EXAMPLE OF OPTIMIZING IMPORTS FOR PRODUCTION APP
// import { Observable } from 'rxjs/Observable';
// import "rxjs/add/operator/map";

/*
*
* OBSERVER EVENTS FOR DOM ELEMENTS
*
*/
let circle = document.getElementById('circle');
let $mouseMove = Observable.fromEvent(document, "mousemove")
    .map((e : MouseEvent) => {
        return{
            x: e.clientX,
            y: e.clientY
        }
    })
    .delay(300);

function onNext(value){
 circle.style.left = value.x + "px";
 circle.style.top = value.y + "px";
}

$mouseMove.subscribe(
    onNext,
    e => console.log(`e: ${e}`),
    () => console.log("compelete")
 );

//data
let numbers = [1,2,10];

//data Source
let source = Observable.from(numbers);

/*
*
*  SIMPLE WAY TO WRITE AN OBSERVERE THAT CONSUMES DATA AND COMPLETES
*
*/
source.subscribe(
    value => console.log(`value: ${value}`),
    e => console.log(`value: ${e}`),
    () => console.log("compelete")
 );




/*
*
*  FORMAL WAY TO WRITE OBSERVABLE CLASS
*
*/

//Interface that looks for numbers and formally uses the observer interface
class MyObserver implements Observer<number> {
    
    //everytime an item comes into the observer this method is fired
    next(value){
     console.log(`value: ${value}`);
    }
    error(e){
        console.log(`value: ${e}`);
    }
    complete(){
        console.log("compelete");
    }
}

//source.subscribe(new MyObserver());


/*
*
*  REAL OBSERVABLE
*
*/
let numbersAlternate = [2,4,20];
let observable = Observable.create(observer => {

    let index = 0;
    let produceValue = () => {
        
        // The first value of index that is passed in the next method is 0
        // Then the setTimeout is called and the next method is called again 

        //index goes in as value = 0 and is sent to the subscribe as 0
        //THEN it gets added to itself
        //so basically the NEXT time a number comes in it will increase
        observer.next(index);

        //Just simply add index ++ after it gets sent - less confusing
        index++;

        //check if the index is less than the total length
        //if it is - keep pumping values out
        //if it isn't - then complete the stream
        if( index < numbersAlternate.length ){
            
            setTimeout(produceValue, 2000);
        }else{
            observer.complete();
        }
    }
    
    // Call once to start the repeating function
    produceValue();
    
})
.map(n => n * 2);

observable.subscribe(
    value => console.log(`value: ${value}`),
    e => console.log(`value: ${e}`),
    () => console.log("compelete")
 );