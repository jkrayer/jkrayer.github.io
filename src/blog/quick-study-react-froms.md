---
title: "A quick study on form rendering"
description:
date: 2021-03-04
tags:
  - posts
  - React
footnotes:
---

Recently I joined a React team and inherited a complex project in its infancy. While debugging a bit of code I noticed changes to any given form field caused re-renders across the whole page. I suspected it had something to do with the level at which the form data was being saved and how it was being stored. Which is to say that it was being saved as an object in a `useState` hook at the page level and being passed down through one or more levels of components.

That would mean that any update to any form field would call `setState` on the form data object like `setState({...oldFormData, name: 'Ji' })` causing all of the dependencies to re-render on each update. This isn't something I'm questioning since I could see console logs rolling in and see lag when typing. I record it here mostly as a reminder of the issue to my future self.

Rather than tearing down a whole section of the app I decided to do a quick iterative study on forms in React to cement my basic knowledge, see where I might make impactful changes and play with hooks I haven't yet had the opportunity to use.

## 1. Uncontrolled

Not recommended by React but the simplest way to get started with a form field. Beautifully no re-renders on data change. Sadly no practical way (this iteration) to get the field's value.

```js
const App = () => {
  const fruit = ["Apple", "Orange", "Banana", "Pear"];

  return (
    <label>
      Fruit:&nbsp;
      <select>
        {fruit.map((f, i) => (
          <option key={i} value={f}>
            {f}
          </option>
        ))}
      </select>
    </label>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
```

## 2 Add props

Just the next step in the evolution toward re-usable components. Nothing important to see here.

```js
const App = ({ label, options }) => (
  <label>
    {label}&nbsp;
    <select>
      {options.map((f, i) => (
        <option key={i} value={f}>
          {f}
        </option>
      ))}
    </select>
  </label>
);

ReactDOM.render(
  <App label="Fruit" options={["Apple", "Orange", "Banana", "Pear"]} />,
  document.getElementById("app")
);
```


## 3. Controlled

The recommended solution to form fields in React, controlled component. There is one re-render for every change but it's a tiny light weight component so no worries.

```js
const App = ({ label, options }) => {
  const [selected, setSelected] = useState(options[0]);

  return (
    <label>
      {label}&nbsp;
      <select
        value={selected}
        onChange={(event) => setSelected(event.target.value)}
      >
        {options.map((f, i) => (
          <option key={i} value={f}>
            {f}
          </option>
        ))}
      </select>
    </label>
  );
};

ReactDOM.render(
  <App label="Fruit" options={["Apple", "Orange", "Banana", "Pear"]} />,
  document.getElementById("app")
);
```

## 4. Controlled

A more practical example of a re-usable component that more closely resembles my situation. As expected calling `setSelected` from the child component updates the state in the parent causing both to re-render.

```js
const Select = ({ label, options, value, setValue }) => (
  <label>
    {label}
    <select value={value} onChange={(event) => setValue(event.target.value)}>
      {options.map((f, i) => (
        <option key={i} value={f}>
          {f}
        </option>
      ))}
    </select>
  </label>
);


const App = () => {
  const [selected, setSelected] = useState("Pear");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        console.log("form", e);
      }}
    >
      <Select
        label="Fruit"
        options={["Apple", "Orange", "Banana", "Pear"]}
        value={selected}
        setValue={setSelected}
      />
      <button type="submit">Submit</button>
    </form>
  );
};
ReactDOM.render(<App />, document.getElementById("app"));
```

## 5. Context

No difference here and none honestly epected. I knew ahead of time that context would have the same communication pattern as the prior example but I also wanted to rule it out.

```js
const FormContext = React.createContext({});

const Select = ({ label, options, value, setValue }) => {
  console.log("render-Select");
  const form = useContext(FormContext);

  return (
    <label>
      {label}&nbsp;
      <select
        value={form.value}
        onChange={(event) => form.setValue(event.target.value)}
      >
        {options.map((f, i) => (
          <option key={i} value={f}>
            {f}
          </option>
        ))}
      </select>
    </label>
  );
};

const App = () => {
  const [selected, setSelected] = useState("Pear");

  console.log("App", selected);
  return (
    <FormContext.Provider value={ {value: selected, setValue: setSelected} }>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log("form", e);
        }}
      >
        <Select label="Fruit" options={["Apple", "Orange", "Banana", "Pear"]} />
        <button type="submit">Submit</button>
      </form>
    </FormContext.Provider>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));

```

## 6. forwardRef

One render. Simple and easy but of course creating a ref for every form field and writing a function to collect them all for every form would be a bit verbose. I also experimented with `e.target.children` but trying to get out of React from React did not feel right. So it wasn't an avenue I wanted to pursie deeply at this time.

```js
const Select = React.forwardRef(
  ({ label, options, initialValue = "" }, ref) => {
    const [selected, setSelected] = useState(initialValue);

    return (
      <label>
        {label}&nbsp;
        <select
          ref={ref}
          value={selected}
          onChange={(event) => setSelected(event.target.value)}
        >
          {options.map((f, i) => (
            <option key={i} value={f}>
              {f}
            </option>
          ))}
        </select>
      </label>
    );
  }
);

const App = () => {
  const sel = useRef(null);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        console.log("form", sel.current.value);
      }}
    >
      <Select
        ref={sel}
        label="Fruit"
        options={["Apple", "Orange", "Banana", "Pear"]}
      />
      <Select ref={sel} label="Veg" options={["Carrots", "Peas", "Brocolli"]} />
      <button type="submit">Submit</button>
    </form>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
```


## 7. Multiple pass down, form state, useReducer

For this round I tried three different strategies. First storing state for each field separately. This produced the rendering result I wanted but wuuld be prohibitive in a production situation. The second was storing form state in a single state hook which was really just a reversion to the case that provoked this little study. Last I tried the `useReducer` hook. Still not a solution for rendering but I've other complexity issues this hook could address nicely so I'm glad I had a chance to use it.

```js
const initialState = { fruit: "", veg: "" };

function reducer(state, action) {
  switch (action.type) {
    case "fruit":
      return { ...state, fruit: action.data };
    case "veg":
      return { ...state, veg: action.data };
    default:
      return state;
  }
}

const Select = ({ label, options, value, setValue }) => {
  return (
    <label>
      {label}&nbsp;
      <select value={value} onChange={(event) => setValue(event.target.value)}>
        {options.map((f, i) => (
          <option key={i} value={f}>
            {f}
          </option>
        ))}
      </select>
    </label>
  );
};

const App = () => {
  //   const [selectedFruit, setSelectedFruit] = useState("");
  //   const [selectedVeg, setSelectedVeg] = useState("");
  //   const [form, setForm] = useState({ fruit: '', veg: ''});
  const [state, dispatch] = useReducer(reducer, initialState);
  console.log("App");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        console.log("form", e.target[0].value, e.target[1].value);
      }}
    >
      <Select
        label="Fruit"
        options={["Apple", "Orange", "Banana", "Pear"]}
        value={state.fruit}
        setValue={(s) => dispatch({ type: "fruit", data: s })}
      />
      <Select
        label="Veg"
        options={["Carrots", "Peas", "Brocolli"]}
        value={state.veg}
        setValue={(s) => dispatch({ type: "veg", data: s })}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
```

## 8. React.memo

I really liked this solution too though this is probably a naive comparision. I'd probably want to confirm that the values list had not changed as well and I could see there being a diminishing return if I was attempting to compare every value in two lists on every render. Perhaps camparing length and a small subset of the options would be sufficient.

```js
const Select = React.memo(
  ({ label, options, value, setValue }) => {

    return (
      <label>
        {label}&nbsp;
        <select
          value={value}
          onChange={(event) => setValue(event.target.value)}
        >
          {options.map((f, i) => (
            <option key={i} value={f}>
              {f}
            </option>
          ))}
        </select>
      </label>
    );
  },
  (prevProps, nextProps) => prevProps.value === nextProps.value
);

const initialState = { fruit: "", veg: "" };

function reducer(state, action) {
  switch (action.type) {
    case "fruit":
      return { ...state, fruit: action.data };
    case "veg":
      return { ...state, veg: action.data };
    default:
      return state;
  }
}

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        console.log("form", e.target[0].value, e.target[1].value);
      }}
    >
      <Select
        label="Fruit"
        options={["Apple", "Orange", "Banana", "Pear"]}
        value={state.fruit}
        setValue={(s) => dispatch({ type: "fruit", data: s })}
      />
      <Select
        label="Veg"
        options={["Carrots", "Peas", "Brocolli"]}
        value={state.veg}
        setValue={(s) => dispatch({ type: "veg", data: s })}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
```

## Final Thoughts

Eight passes was about enough for me to decide that I had done my due dilligence. The lessons were basically known from the beginning. Store the form state as close to where it's being used as possible. Keep an eye on what triggers re-renders. Consider a more well formed solution to form data for React.

This brief study really only concerned itself with render but our application is heavy on forms some of which have complex state needs. I've all ready made it a near future priority to explore Formik and XState.
