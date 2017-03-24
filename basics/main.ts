import { Observer, Observable } from 'rxjs';

import {load, loadWithFetch} from './loader';

/*
*
* SECTION 3 OBSERVABLE EXAMPLE - merge and skip error
*
*/
let observThree = Observable.merge(
    Observable.of(1),
    Observable.from([2,3,4,5,]),
    Observable.throw(new Error("Stop!")),
    Observable.of(6)
).catch(e => {
    console.log(`Caught: ${e}`);
    return Observable.of(7);
});

observThree.subscribe(
    value => console.log(`value: ${value}`),
    e => console.log(`value: ${e}`),
    () => console.log("Complete")
)


/*
*
* OBSERVER BUTTON EVENTS FOR DOM ELEMENTS
*
*/
let button = document.getElementById('movies');
let output = document.getElementById('output');

let $click = Observable.fromEvent(button, "click");


function renderMovies(movies) {
    console.log(movies);
    movies.forEach(m => {
        let div = document.createElement("div");
        div.innerText = m.title;
        output.appendChild(div);
    })
}

let moviesUrl = "/data/movies.json";
let moviesUrlError = "movies.json";
//flatmap automaticall subscribes to the load observable that is returned
//we can then subscribe to the flatmap and render those results

//Switch in out with load or loadWithFetch
$click.flatMap(e => loadWithFetch(moviesUrlError))
    .subscribe(
    renderMovies,
    e => console.log(`error: ${e}`),
    () => console.log("Complete")
    );

//Store an observable subscription into a variable so we can cancel it later
//this does initialize the Observable right away however
let subscription = 
    load(moviesUrl)
        .subscribe(
            renderMovies,
            e => console.log(`error: ${e}`),
            () => console.log("Complete")
        );

subscription.unsubscribe();