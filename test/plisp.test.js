import plisp from '../src/plisp.js'


var lsp = new plisp()
lsp._out = ''
lsp.logger = (val) => lsp._out += val
lsp.maxStack = 1000

test('lisp 1 + 1 to equal 2', () => {
  let res = lsp.run('(+ 1 1)')
  return res.then((res) => {
    expect(res).toBe(2)
  })
});

test('nested unformated lisp to correct value', () => {
  let res = lsp.run('(  - 20 (+ 1 (* 3 3 ) 2))')
  return res.then((res) => {
    //expect(res).toBe(2)
    expect(res).toBe(8)
  })
});

test('async functions', () => {
  // set a async lisp function
  lsp.opers.get = (...x) => {
    return new Promise((resolve, reject) => {
      window.setTimeout(() => {
        resolve(10)
      }, 10)
    })
  }

  let res = lsp.run('(+ 1 (get))')
  return res.then((res) => {
    expect(res).toBe(11)
  })
});

test('NotFoundException when try to create unknow element', () => {
  let res = lsp.run('(xxx)')
  return res.then((res) => {
    //..
  }).catch((res) => {
    expect(res.name).toBe('NotFoundException')
  })
});

test('to be neste lists', () => {
  let res = lsp.run('(list 1 2 3 (list a b c))')
  return res.then((res) => {
    expect(res).toEqual([ '1', '2', '3', [ 'a', 'b', 'c' ] ])    
  })
});

test('to float list', () => {
  let res = lsp.run('(float 3 4 5)')
  return res.then((res) => {
    expect(res).toEqual([3, 4, 5])
  })
});

test('if letter character to be true', () => {
  let res = lsp.run('(if a 1 2)')
  return res.then((res) => {
    expect(res).toEqual('1')
  })
});

test('if zero character to be false', () => {
  let res = lsp.run('(if 0 1 2)')
  return res.then((res) => {
    expect(res).toEqual('2')
  })
});

test('if non zero character to be true', () => {
  let res = lsp.run('(if 1 1 2)')
  return res.then((res) => {
    expect(res).toEqual('1')
  })
});

test('if false without else to be null', () => {
  let res = lsp.run('(if 0 1)')
  return res.then((res) => {
    expect(res).toBe(null)
  })
});

test('if true without else to be the value', () => {
  let res = lsp.run('(if 1 1)')
  return res.then((res) => {
    expect(res).toBe('1')
  })
});

test('if true without else to be the value', () => {
  let res = lsp.run('(if 1 1)')
  return res.then((res) => {
    expect(res).toBe('1')
  })
});

test('to evaluate the true condition', () => {
  let res = lsp.run('((if (+ 0 1) (setvar a 1) (setvar b 2))(ctx))')
  return res.then((res) => {
    expect(res).toEqual({a: '1'})
  })
});

test('to evaluate the else', () => {
  let res = lsp.run('((if (- 1 1) (setvar a 1) (setvar b 2))(ctx))')
  return res.then((res) => {
    expect(res).toEqual({b: '2'})
  })
});

test('to bool true', () => {
  let res = lsp.run('(bool 1)')
  return res.then((res) => {
    expect(res).toBe(true)
  })
});

test('to bool false', () => {
  let res = lsp.run('(bool 0)')
  return res.then((res) => {
    expect(res).toBe(false)
  })
});

test('to bool bool type true', () => {
  let res = lsp.run('(bool (= 1 1))')
  return res.then((res) => {
    expect(res).toBe(true)
  })
});

test('to bool bool type false', () => {
  let res = lsp.run('(bool (= 1 2))')
  return res.then((res) => {
    expect(res).toBe(false)
  })
});

test('print return null and out text', () => {
  let res = lsp.run('(print lala)')
  return res.then((res) => {
    expect(res).toBe(null)
    expect(lsp._out).toBe('lala')
  })
});

test('setvar be the value to x and return ctx', () => {
  let res = lsp.run('((setvar x val)(ctx))')
  return res.then((res) => {
    //console.log(res)
    expect(res).toEqual({x: 'val'})
  })
});

test('dont polute ctx', () => {
  let p1 = lsp.run('((setvar x val)(ctx))')
  return p1.then((res) => {
    expect(res).toEqual({x: 'val'})
    return lsp.run('((setvar y otherval)(ctx))')
  }).then((res) => {
    expect(res).toEqual({y: 'otherval'})
  })
});

test('set array', () => {
  let res = lsp.run('((setvar x (list 1 2 3))(ctx))')
  return res.then((res) => {
    //console.log(res)
    expect(res).toEqual({x: ['1', '2', '3']})
  })
});

test('get the var', () => {
  let res = lsp.run('(getvar x (setvar x 123))')
  return res.then((res) => {
    //console.log(res)
    expect(res).toBe('123')
  })
});

test('get undefined var return null', () => {
  let res = lsp.run('(getvar y (setvar x 123))')
  return res.then((res) => {
    //console.log(res)
    expect(res).toBe(null)
  })
});

test('get the var with sintax sugar', () => {
  let res = lsp.run('((setvar x 123)(&x))')
  return res.then((res) => {
    //console.log(res)
    expect(res).toBe('123')
  })
});

test('get null, because of Promise.all', () => {
  let res = lsp.run('(((setvar x 123)(&x)))')
  return res.then((res) => {
    //console.log(res)
    expect(res).toBe(null)
  })
});

test('true to be equal', () => {
  let res = lsp.run('(= 1 1)')
  return res.then((res) => {
    expect(res).toBe(true)
  })
});

test('true to be equal multiple', () => {
  let res = lsp.run('(= 1 1 1)')
  return res.then((res) => {
    expect(res).toBe(true)
  })
});

test('false to be equal multiple', () => {
  let res = lsp.run('(= 1 1 2)')
  return res.then((res) => {
    expect(res).toBe(false)
  })
});

test('true to be >', () => {
  let res = lsp.run('(> 2 1 0)')
  return res.then((res) => {
    expect(res).toBe(true)
  })
});

test('false to be <', () => {
  let res = lsp.run('(< 1 1 2)')
  return res.then((res) => {
    expect(res).toBe(false)
  })
});

test('true to be <=', () => {
  let res = lsp.run('(<= 1 1 1)')
  return res.then((res) => {
    expect(res).toBe(true)
  })
});

test('false to be <=', () => {
  let res = lsp.run('(<= 2 1 2)')
  return res.then((res) => {
    expect(res).toBe(false)
  })
});

test('true to be >=', () => {
  let res = lsp.run('(>= 3 2 1)')
  return res.then((res) => {
    expect(res).toBe(true)
  })
});

test('true to be >= two itens', () => {
  let res = lsp.run('(>= 3 2)')
  return res.then((res) => {
    expect(res).toBe(true)
  })
});

test('false to be >=', () => {
  let res = lsp.run('(>= 1 2 1)')
  return res.then((res) => {
    expect(res).toBe(false)
  })
});

test('true to be /=', () => {
  let res = lsp.run('(/= 1 2)')
  return res.then((res) => {
    expect(res).toBe(true)
  })
});

test('false to be /=', () => {
  let res = lsp.run('(/= 2 2)')
  return res.then((res) => {
    expect(res).toBe(false)
  })
});

test('false to be all different', () => {
  let res = lsp.run('(/= 2 1 2)')
  return res.then((res) => {
    expect(res).toBe(false)
  })
});

test('true to be all different', () => {
  let res = lsp.run('(/= 1 2 3)')
  return res.then((res) => {
    expect(res).toBe(true)
  })
});

test('true to be all combinations', () => {
  let res = lsp.run('(combine 1 2 3)')
  return res.then((res) => {
    expect(res).toEqual([ [ '1', '2' ], [ '1', '3' ], [ '2', '3' ] ])
  })
});

test('true to be the combination', () => {
  let res = lsp.run('(combine 1 2)')
  return res.then((res) => {
    expect(res).toEqual([ [ '1', '2' ] ])
  })
});

test('to run multiple', () => {
  let res = lsp.run(`((run (setvar x a)(setvar y b))(ctx))`)
  return res.then((res) => {
    expect(res).toEqual({'x': 'a', 'y': 'b'})
  })
});

test('to run multiple without run', () => {
  let res = lsp.run(`(( (setvar x a) (setvar y b) ) (ctx))`)
  return res.then((res) => {
    expect(res).toEqual({'x': 'a', 'y': 'b'})
  })
});


test('to incf', () => {
  let res = lsp.run(`((run (setvar x 1) (incf x 2))(ctx))`)
  return res.then((res) => {
    expect(res).toEqual({'x': 3})
  })
});

test('to incf multiple', () => {
  let res = lsp.run(`((run (setvar x 1) (incf x 2 2))(ctx))`)
  return res.then((res) => {
    expect(res).toEqual({'x': 5})
  })
});


test('to incf non existing var returning NaN', () => {
  let res = lsp.run(`((run (incf x 2))(ctx))`)
  return res.then((res) => {
    expect(res).toEqual({'x': NaN})
  })
});

test('to incf return its before value', () => {
  let res = lsp.run(`((run (setvar x 0) (setvar y (incf x 1)) )(ctx))`)
  return res.then((res) => {
    expect(res).toEqual({ x: 1, y: 0 })
  })
});

test('to set r false', () => {
  let res = lsp.run(`((run (setvar x 0) (setvar r (< (getvar x (incf x 5)) 5)))(ctx))`)
  return res.then((res) => {
    expect(res).toEqual({ x: 5, r: false })
  })
});

test('to loop', () => {
  let res = lsp.run(`((run (setvar c 0) (loop (if (< (incf c 1) 9) (print aqui) (return) ) ) ) (ctx))`)
  return res.then((res) => {
    expect(res).toEqual({ c: 10 })
  })
});

test('to loop on nested return', () => {
  let res = lsp.run(`((run (setvar c 0) (loop (if (< (incf c 1) 4) (print aqui) (list (list (return) x)) ) ) ) (ctx))`)
  return res.then((res) => {
    expect(res).toEqual({ c: 5 })
  })
});

test('to nested loop count to 100', () => {
  let program = `
( 
  (setvar count 0)
  (setvar a 0)
  (loop 
    (if 
      (< (incf a 1) 10)
      (
        (setvar b 0)
        (loop 
          (if 
            (< (incf b 1) 10)
            (incf count 1)
            (return)
          )
        )
      )
      (return)
    )
  )
  (ctx)
)`
  let programStr = program.split('\n').join('')
  let res = lsp.run(programStr)
  return res.then((res) => {
    expect(res).toEqual({ count: 100, a: 11, b: 11 })
  })
});

test('to loop until max stack error', () => {
  let res = lsp.run(`(loop (print infloop))`)
  return res.then((res) => {
    //...
  }).catch((err) => {
    expect(err).toBeInstanceOf(lsp.MaxStackError)
  })
});

test('sleep the specified time', () => {
  let ini = Date.now()
  let res = lsp.run(`((sleep 50) (setvar x ok))`)
  return res.then((res) => {
    expect(Date.now() - ini).toBeGreaterThanOrEqual(50)
  })
});

test('dolist', () => {
  let res = lsp.run(`((setvar res 0) (dolist (x (list 1 2 3) ) (incf res (getvar x) ) )(ctx))`)
  return res.then((res) => {
    expect(res).toEqual({ res: 6, x: '3' })
  })
});


test('proper way to nested dolist', () => {
  let program = `
( 
  (setvar c 0)
  (setvar a (list 2 2)) 
  (setvar b (list 2 2)) 
  (dolist (i (getvar a) ) (dolist (j (getvar b) ) (incf c (getvar i) (getvar j)) ) )
  (ctx)
)
`

  let programStr = program.split('\n').join('')
  let res = lsp.run(programStr)
  return res.then((res) => {
    expect(res).toEqual({ c: 16, a: [ '2', '2' ], b: [ '2', '2' ], i: '2', j: '2' })
  })
});

test('nested dolist', () => {
  let program = `
( 
  (setvar c 0)
  (dolist (i (list 2 2) ) (dolist (j (list 2 2) ) (incf c (getvar i) (getvar j)) ) )
  (ctx)
)`

  let programStr = program.split('\n').join('')
  let res = lsp.run(programStr)
  return res.then((res) => {
    expect(res).toEqual({ c: 16, i: '2', j: '2' })
  })
});