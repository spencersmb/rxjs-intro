import { Observer, Observable } from 'rxjs';


//promises not inheriently lazy so we use Defer()
export function loadWithFetch(url: string) {

    //defer only gets called when someone subscribes to this Observable
    return Observable.defer(() => {

        //this return the raw response
        return Observable.fromPromise(

            //serialze the info so its usable
            fetch(url).then(r => {

                if(r.status === 200){
                    return r.json();
                }else{
                    let reject = Promise.reject(r);
                    // console.log(reject);
                    return reject;
                }

            })
        );

    })
    .retryWhen(retryStrategy());
}


//load returns an observable
export function load(url: string) {

    return Observable.create(observer => {

        let xhr = new XMLHttpRequest();
        let onLoad = () => {
            if (xhr.status === 200) {
                let data = JSON.parse(xhr.responseText);

                observer.next(data);
                observer.complete();
            } else {
                observer.error(xhr.statusText);
            }
        }

        xhr.addEventListener("load", onLoad);

        xhr.open("GET", url);
        xhr.send();

        //Add option for observable to unsubscribe
        return () => {

            xhr.removeEventListener('load', onload);
            xhr.abort();

        }


        // retry gets called but only inits when an observable error gets passed in
        // the error object automatically gets passed into the return function of the retryStrategy()
        // retryWhen delivers errors to our observable basically
    }).retryWhen(retryStrategy({
        attempts: 3,
        delay: 1500
    }));

}


//use es6 destructing
//default attempts & delay
//empty object is default so allow us to work with promises that are rejected
// I think because it passes an object
export function retryStrategy({ attempts = 4, delay = 1000 } = {}) {

    //this annon function takes in the xhr.statusText error object
    //from the else { observer.error(xhr.statusText); }
    return (errors) => {

        //return the error object and operate on it
        //it gets passed through after it gets operated on
        //retry 4 times 
        //scan counts how many times something has happen and takes in the value, value is the error being passed in
        return errors
            .scan((acc, value) => {
                console.log(acc, value);
                return acc + 1; //return +1 to keep counting

                //start AT 0 count
            }, 0)

            //take a value in while its less than 4
            //keep pushing an observable until it reachs 4
            .takeWhile(acc => acc < attempts)

            //Delay the repeat try by 1sec
            .delay(delay);
    }
}