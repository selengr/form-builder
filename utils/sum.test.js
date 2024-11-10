

const sum = require('./sum');


describe("a little something",()=>{
// null
  test('null', () => {
    const n = null;
    expect(n).toBeNull();
    expect(n).toBeDefined();
    expect(n).not.toBeUndefined();
    expect(n).not.toBeTruthy();
    expect(n).toBeFalsy();
  });


// 0
  test('zero', () => {
    const z = 0;
    expect(z).not.toBeNull();
    expect(z).toBeDefined();
    expect(z).not.toBeUndefined();
    expect(z).not.toBeTruthy();
    expect(z).toBeFalsy();
  });

  
// Number
  test('two plus two', () => {
    const value = 2 + 2;
    expect(value).toBeGreaterThan(3);
    expect(value).toBeGreaterThanOrEqual(3.5);
    expect(value).toBeLessThan(5);
    expect(value).toBeLessThanOrEqual(4.5);
  
    // toBe and toEqual are equivalent for numbers
    expect(value).toBe(4);
    expect(value).toEqual(4);
  });
  

// FLOATING  
  test('adding floating point numbers', () => {
    const value = 0.1 + 0.2;
    //expect(value).toBe(0.3);           This won't work because of rounding error
    expect(value).toBeCloseTo(0.3); // This works.
  });



  // STRING
  test('there is no I in team', () => {
    expect('team').not.toMatch(/I/);
  });
  
  test('but there is a "stop" in Christoph', () => {
    expect('Christoph').toMatch(/stop/);
  });



  // ARRAY
  const shoppingList = [
    'diapers',
    'kleenex',
    'trash bags',
    'paper towels',
    'milk',
  ];
  
  test('the shopping list has milk on it', () => {
    expect(shoppingList).toContain('milk');
    expect(new Set(shoppingList)).toContain('milk');
  });

  //Exceptions for =====>  FUNCTION
  function compileAndroidCode() {
    throw new Error('you are using the wrong JDK!');
  }


  test('compiling android goes as expected', () => {
    expect(() => compileAndroidCode()).toThrow();
    expect(() => compileAndroidCode()).toThrow(Error);
  
    // You can also use a string that must be contained in the error message or a regexp
    expect(() => compileAndroidCode()).toThrow('you are using the wrong JDK');
    expect(() => compileAndroidCode()).toThrow(/JDK/);
  
    // Or you can match an exact error message using a regexp like below
    // expect(() => compileAndroidCode()).toThrow(/^you are using the wrong JDK$/); // Test fails
    // expect(() => compileAndroidCode()).toThrow(/^you are using the wrong JDK!$/); // Test pass
  });


  // PRPMISES
  // test('the data is peanut butter', () => {
  //   return fetchData().then(data => {
  //     expect(data).toBe('peanut butter');
  //   });
  // });

  // test('the data is peanut butter', async () => {
  //   const data = await fetchData();
  //   expect(data).toBe('peanut butter');
  // });


  // ASYNC and await
  // test('the fetch fails with an error', async () => {
  //   expect.assertions(1);
  //   try {
  //     await fetchData();
  //   } catch (error) {
  //     expect(error).toMatch('error');
  //   }
  // });


  // WITH ==> .resolves or .rejects.
  // test('the data is peanut butter', async () => {
  //   await expect(fetchData()).resolves.toBe('peanut butter');
  // });
  
  // test('the fetch fails with an error', async () => {
  //   await expect(fetchData()).rejects.toMatch('error');
  // });


  // Don't do this!
// test('the data is peanut butter', () => {
//   function callback(error, data) {
//     if (error) {
//       throw error;
//     }
//     expect(data).toBe('peanut butter');
//   }

//   fetchData(callback);
// });

})
