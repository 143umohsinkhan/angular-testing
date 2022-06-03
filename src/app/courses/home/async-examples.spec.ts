import { fakeAsync, flush, flushMicrotasks, tick } from "@angular/core/testing";

describe("Async Testing Examples", () => {
  it("Asynchronous test example with Jasmine done()", (done: DoneFn) => {
    let test = false;

    setTimeout(() => {
      console.log("running assertions");

      test = true;

      expect(test).toBeTruthy();

      done();
    }, 1000);
  });

  // #1
  it("async with promise +setTimeout", () => {
    console.log("Start!");

    setTimeout(() => {
      console.log("Timeout!");
    }, 0);

    Promise.resolve("Promise!").then((res) => console.log(res));

    console.log("End!");
  });

  // #2
  it("Asynchronous test example - Promises + setTimeout() no async", () => {
    console.log("start");

    setTimeout(() => {
      console.log("executed in setTimeout1");
    });

    Promise.resolve().then(() => {
      console.log("executed in promise1");
    });

    setTimeout(() => {
      console.log("executed in setTimeout2");
    });

    Promise.resolve().then(() => {
      console.log("executed in promise2");
    });

    console.log("end");
    expect(true).toBeTruthy();
  });

  // fakeAsync zone (detect async operation) - zone.js(Change detection in angular)
  it("Asynchronous test example - setTimeout()", fakeAsync(() => {
    let test = false;

    setTimeout(() => {});

    setTimeout(() => {
      console.log("running assertions setTimeout()");
      test = true;
    }, 1000);

    flush();

    expect(test).toBeTruthy();
  }));

  it("Asynchronous test example - plain Promise", fakeAsync(() => {
    let test = false;

    console.log("Creating promise");

    Promise.resolve()
      .then(() => {
        console.log("Promise first then() evaluated successfully");

        return Promise.resolve();
      })
      .then(() => {
        console.log("Promise second then() evaluated successfully");

        test = true;
      });

    flushMicrotasks();
    console.log("Running test assertions");

    expect(test).toBeTruthy();
  }));

  fit("Asynchronous test example - Promises + setTimeout()", fakeAsync(() => {
    let counter = 0;

    Promise.resolve().then(() => {
      counter += 10;

      setTimeout(() => {
        counter += 1;
      }, 1000);
    });

    expect(counter).toBe(0);
    console.log(counter);

    flushMicrotasks();

    expect(counter).toBe(10);

    tick(500);

    expect(counter).toBe(10);
    console.log(counter);

    tick(500);

    expect(counter).toBe(11);
    console.log(counter);
  }));
});
