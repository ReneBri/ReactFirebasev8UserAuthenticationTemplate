# DOCUMENTATION

## OVERVIEW

This is a user login / authentication template built using React and Firebase Authentication v8.

Live link to a demo can be found [here](https://reactfirebasev8authtemplate.web.app).

I have build this for multiple reasons:
* To lower the time it takes to build app ideas in the future. Especially now to be able to approach others to work together on group projects.
* Consolidate knowledge learnt during my courses.
* Prove that I can do it.
* Hopefully receive feedback from peers about what I can improve / what I did wrong.

Please, if you come across this and have any feedback or ideas for improvement, I would be happy to hear from you.

**GETTING STARTED:**

***Getting started with this template is really simple:***
1. Clone this repo locally
2. Run 'npm i' in that directory
3. Create a new Firebase project
4. Inside the new Firebase project, create a new web app
5. Get the web app config credentials and paste them into the commented space in the './config/firebaseConfig.js'
6. In this projects Firebase console enable Authentication
7. Inside the Firebase consoles' Authentication section enable providers 'sign-in with username and password' & 'Google'
8. npm run start & test

***Covered so far in the documentation is:***
1. Authentication Hooks
2. Routeing
3. Modals
4. Auth Context API

More documentation to come over the next week...


## AUTHENTICATION HOOKS

All of the authentication hooks generally follow the same structure, with the exceptions of ‘useValidateUserInput’ & ‘useChangeEmail’, which I will give their own sections at the end.

Each hook returns an object with two properties. The first is a function and the second is an object which provides updates about the status of that function. For example if the function request is pending, has an error or has been completed successfully. 

**THE FUNCTION:**

All of these returned authentication hook functions are asynchronous. This is because they are connecting with and updating the Firebase Authentication service, which takes time to do. These functions also update our User Context API, so that both the User Context and the Firebase Authentication service are in sync.
Within these functions we have some conditionals, which are dictated by the isCancelled piece of state. These are our clean-up conditionals, so that if our component dismounts the state will not be updated. It is also within these functions that if you were to update an external database, like MongoDB for example, you would add use of another hook to do so within this function.

**THE OBJECT:**

The object returned usually consists of three key value pairs:
1. isPending - This tells us if the function called in the hook is still in process.
2. error - This will display the error message should one be returned from Firebase.
3. success - This tells us wether our function was successful or not. Its original default value is null.

Using these three pieces of state we can conditionally display different jsx elements in our components depending on their values.

**THE CLEAN-UP FUNCTION:**

 This is not returned but is present in our hook. It is the function ‘setIsCancelled(true);’ which is returned inside of the empty useEffect at the end of our hook. Since a useEffect clean-up function runs on mount and at the start of every subsequent re-render, at the start of our returned function we need to reset isCancelled to false.

**EXAMPLE:**

To give an example of how one of these hooks are used within a component I will use the ‘useLoginWithEmailAndPassword’ hook:
```
import { useLoginWithEmailAndPassword } from ‘../../hooks/authentication-hooks/useLoginWithEmailAndPassword’;

const Component = () => {

	const { login, loginState } = useLoginWithEmailAndPassword();

	return (
		{!loginState.isPending ? <button onClick={() => login(email, password)}>Login<button> : <button disabled>Logging in<button>}
	)

}	
```

***

 ## ROUTEING

All routing can be found within the App.js file and uses React Router v6. So far there is only 3 different pages:
1. The Home page, which a user can only see when logged out.
2. The Dashboard, which only a logged in user can see.
3. The Account Settings page, which only a logged user can see.

All other authentication services happen with the use of modals.

**ROUTE GUARDING:**

The routing here so far is quite basic. For example the home path (‘/‘) will route you to a different page (either Home or Dashboard) depending on your login status. This basic route guarding also expends to the Account Settings page and should continue like this throughout the entirety app. 

**LOADING SCREEN:**

When first loading the page connecting to Firebase to check wether a user is logged in or not can take some time. So that we do not have a blank screen during this period I have added a PreLoader component, which basically tells the user that the service won’t be long and shows a loading SVG. This should help with visitor retention.

**MODALS:**

Furthermore, you will see at the top of the ‘App’ div that there are multiple lines referring to the modalState. This is so that if the Modal Context says that a modal is to be rendered on the screen, it is here we create the portal. The portal leads to a div with the id of ‘modal-root’ in the index.html file.

**ROUTE GUARDING USING MODALS:**

This line of code:
```
{!modalState && user.user !== null && !user.user.emailVerified && ReactDOM.createPortal(<UnverifiedEmail />, document.getElementById(‘modal-root’))}
```

Is route guarding, so that the user cannot use the websites’ services unless they have verified their email. This is to help prevent spam accounts.

***

## MODALS

Modals play a big part in this User Login / Authentication template. They are for a large part how users sign-up, login & reauthenticate, etc. Modals visually sit above and cover everything else on the screen, so it only makes sense if the html we render shows this. If we, for example, just rendered our modal inside of whatever component we wanted to use it with, then the html would also be nested within that component. This technically can work but isn’t ideal for accessibility. Screen readers wouldn’t know that the modal is the most important and effectively the only thing on the screen. So to get around this in React we use portals. If you don’t know about portals and want to dive deeper, please check out the React documentation on the matter. But going further I will assume you know about them. In this project, the root element for our portals is located in the index.html - it’s a div with an id of ‘modal-root’. The portal itself is located App.js file - above any of the other routing.

**MODAL CONTEXT API:**

This template uses the context API to manage which modal should be rendering on the screen, if any should be rendered at all. Otherwise we would have to create portals or ‘prop drill” all over our app, which is far from ideal. So, to solve this we have a simple context API which exports two values, essentially the values that a ‘useState’ hook returns: 
1. The modalState, which has a default value of null.
2. The setModalState function, which is what we use to define which modal should be rendered on the screen.

Furthermore, this ModalContextProvider is nested inside of the AuthContextProvider, so that all of our modals can have access to the User/Auth Context.

**RENDERING A MODAL:**

In order to build your own or change these modals it’s important you know about how the portals work inside of the App.js file. 

This piece of code in App.js is what controls if a modal is rendered or not:
```
{modalState && ReactDOM.createPortal(modalState, document.getElementById(‘modal-root’))}
```
Here you can see that, if modalState exists, React will render the ‘modalState’ inside the element with the id of ‘modal-root’. This is why it is important the default value of modalState is null. Because if there is no value in modalState, no modal will be rendered. But if we keep in mind this above code example and we’re to set the value of modalState to a component (setModalState(< LoginModal />), for example) then the ‘modalState exists’ condition will be met and < LoginModal />, will be rendered inside of the ‘root-modal’ element.

**EXAMPLE:**

That was a lot to take in, so let’s look at a more real world example before we continue and perhaps introduce how we would actually use it inside of a component:
```
// This is the React hook that lets us hook into our context
import { useContext } from ‘react’;

// This is our custom context API we use to set whether or not a modal renders
import { ModalContext } from ‘../../context/ModalContext’;

// This is the modal we want to render
import LoginModal from ‘../../components/modals/authentication-modals/LoginModal’;


export LoginButton = () => {

	// This is how we destructure and access our setModalState function
	const { setModalState } = useContext(ModalContext);

	return (
		<button 
			onClick={() => setModalState(<LoginModal />)}
			>Login
		<button>
	)
}
```

So, this example is a component that consists of a button, which when clicked will open the ‘LoginModal’ modal.

First, we import three things: The useContext hook from React, our ModalContext context API and the modal we want to render (the LoginModal modal).

Then, inside of our component we want to be able to set the ‘modalState’. So, to access that we destructure our ModalContext using the useContext hook.

Then, we set an onClick event on our button to set the modalState to our LoginModal component.

Now, when we click the button, the LoginModal should render to the screen.


If we then wanted to have an exit button on this opened LoginModal component we would simply have to add another component such as this:
```
import { useContext } from ‘react’;

import { ModalContext } from ‘../../context/ModalContext’;

// We do not need to import a modal component as we will only be setting the modalState value to null


export ExitButton = () => {

	const { setModalState } = useContext(ModalContext);

	return (
		<button 
			onClick={() => setModalState(null)}
			>Exit Modal
		<button>
	)
}
```

***

## AUTH CONTEXT API

This template is all about connecting to Firebase Authentication and authenticating users. We do this by making requests to Firebase (like user sign-up or logout) via our custom authentication hooks and in return we receive data back. That response is usually a user object, which contains data such as the users display name, email, phone number, etc. This is helpful, as there is a lot we can do with that information and we can find components all over our app which use it. So, if we were to just save this response from Firebase in state in the App.js file, our app would get messy very quickly with ‘prop drilling’ all over the place. To combat this we use the Context API to hold these responses and deliver them cleanly to wherever our app needs them. In this template it’s called the AuthContext and it wraps the entire app, as you can see from the index.js file.

The AuthContext API is using a reducer to manage the user state. I will assume you know about how the useReducer hook works from here on in. If not please refer to the React docs.

**AUTH CONTEXT VALUE PAIRS:**

Our auth context has three different value pairs:
1. authIsReady: boolean - This confirms that our app has reached out to Firebase Authentication to see whether or not a user is logged in. The function that does this is asynchronous and while it is our fetching the data this keys value will be false. It is only once the data has been fetched and we know whether or not a user is logged in on this device that it will equal true.
2. user: { object } - This is the user object we receive from Firebase when a user signs-up, logs-in, reloads the page, etc. If no user is logged in or a user logs out, then the value is null. If there is a user logged in, we receive back an object full of the users information such as userId, displayName, email, etc.
3. hasPassword: boolean - This looks through our user object to see if the user has signed up using the password method. Re-authentication methods required when a user wants to change their information or delete their account is different for different sign-up methods. For example a user who signed up with their Google account will have to re-authenticate differently to someone who signed up with a password.

**INITIAL PAGE LOAD:**

When a page loads for the first time, we need to find out whether or not a user is already logged in using this device. To do this we need to reach out to Firebase.

In authContext.js you will find a function called onAuthStateChanged(), which is nested inside of a useEffect with an empty dependency array:
```
    useEffect(() => {
        firebaseAuth.onAuthStateChanged((user) => {
            if(user){
                dispatchAuthState({type: 'AUTH_STATE_IS_READY', payload: {...user}});
            }else{
                dispatchAuthState({type: 'AUTH_STATE_IS_READY', payload: user});
            }
        });
    }, []);
```
The purpose of this block is to, upon initial page load, reach out to Firebase and check whether or not a a user is already logged in. Firebase has state persistence for the user - meaning that if a user is signed in and reloads the page, they are still signed in and do not need to do so again. This is great, but our authContext doesn’t know that and upon reload, our authContext resets, giving the user object a value of null. So the purpose of this block is to reach out to Firebase, receive a response and then update our state accordingly, keeping us nicely in-sync with Firebase. 

**AUTHISREADY AND THE LOADING SCREEN:**

As you may have noticed - upon refresh, there is a loading screen. This serves multiple purposes, but the main one being that while React reaches out to the Firebase Authentication service by using onAuthStateChanged(), our AuthContext has its default values. Those being:
```
{ user: null, authIsReady: false, hasPassword: null }
```
As you can see, the default value for user is null. This means that if there were no loading screen, all of page conditionals rendered that depend on whether a user is logged in or not, will render with the 'user' value of 'null' in mind. This can lead to a very jumpy and non-user friendly experience. So to combat this, we use the fact that authIsReady’s default value is false, then only when the user is confirmed by Firebase does it become true.

To take advantage of this, we use routing with this conditional set up in the App.js file:
```
{!user.authIsReady && < PreLoader />}
```
This is so that if the app is still reaching out to Firebase and is yet to receive a response, instead of loading our actual Home page or Dashboard, we load this component < PreLoader />, which is our loading screen. Not only does this help prevent a jumpy user experience, it also helps with visitor retention, as seemingly slow websites are a huge reason for people losing attention and clicking away.

**UPDATING AUTH CONTEXT FROM WITHIN A HOOK OR COMPONENT:**

Most times we call a function that connects to the Firebase Authentication service are from within a custom hook. There are a couple of components in this template which do so without utilising a hook but how we sync it with our AuthContext is the same. 

Our AuthState is quite complex, so we manage it with a reducer. This means we send out dispatch functions in order to update our state. If we, for example, already have a user logged in and we want to update their display name. Once the user has typed in their new display name and we’ve validated it, we would have to send an update request to Firebase Authentication. If this is a successful request, that’s great BUT this means that it is only updated on the Firebase server and NOT our authState. This means that any components using our state to render that display name value will still be rendering the old display name. To keep our authState in-sync with the Firebase Authentication servers we need to also update our authState. Here is an example of how we do this:
```
// config
import firebaseAuth from '../../../../../config/firebaseConfig';

// context
import { AuthContext } from '../../../../../context/authContext';

// hooks
import { useContext} from 'react';

// New component which has a prop of newDisplayName
const UpdateDisplayNameButton = ({ newDisplayName }) => {
	
    // Here we destructure the dispatchAuthState function out of our AuthContext
	const { dispatchAuthState } = useContext(AuthContext);

    // Here is a function which we will call when the button is clicked
	const changeDisplayName = async () => {
		try {
            // This updates the users name in Firebase
			await firebaseAuth.currentUser.updateProfile({
				displayName: newDisplayName
			});
            // This updates our authState
			dispatchAuthState({ type: ‘UPDATE_DISPLAY_NAME’, payload: newDisplayName });
		}
		catch (err) {
			console.log(err.message);
		}

	}
	return (
		<button onClick={() => {changeDisplayName}>Change Display Name<button>
	)				
}
```
Above is a example of a button component, that when clicked will update our display name. As you can see, that for every Firebase action we have, we need an authContext dispatch function to mirror it. But this is just half the story, as the dispatch function is only a messanger... Over in our authContext.js we need to tell our reducer function what to do with the object received from the dispatchAuthState() function.

**AUTHSTATEREDUCER():**

So, below is an example of a simplfied version of our reducer, which is located in the authContext.js file:
```
const authStateReducer = (state, action) => {
    switch (action.type) {
        case 'UPDATE_DISPLAY_NAME':
            return { ...state, user: { ...state.user, displayName: action.payload } };
        default: return { ...state };
    }
}
```
As you can see, the authStateReducer function receives two parameters:
1. The previous state from before the update (called 'state') &
2. The action, which is the object we sent to it via the dispatchAuthState() function (called 'action').

For the sake of the example, here's what the previous state could have been and what we sent in the dispatch function:
```
// Previous state
{ authIsReady: true, hasPassword: true, user: { displayName: 'Rene', email: 'rene@rene.com', phoneNumber: '1234' } }

// Dispatch object
{ type: ‘UPDATE_DISPLAY_NAME’, payload: newDisplayName }
```
So, once the authStateReducer is called by our dispatch function, it checks for the matching 'type' property in the switch statement, in this case its ‘UPDATE_DISPLAY_NAME’. Once it finds a match, it then returns the new state, in this case an object. It does this by spreading out the values of the old state with '...state'. This gives us the old, unchanged values of authIsReady and hasPassword. Then because we specify the 'user' property it will update that property. In this case, spreading out the old values of email and phoneNumber with '...state.user' and then changing the displayName value to that of the 'action.payload', which we specified in the dispatch function. So this then will return the following:
```
{ authIsReady: true, hasPassword: true, user: { displayName: 'New Display Name', email: 'rene@rene.com', phoneNumber: '1234' } }
```

**SECTION CONCLUSION**

This was a hard one to explain. I hope it made sense? I feel that I could have either explained it better or perhaps just assumed more knowledge of the reader and shortened it a bit. If you have any suggestions how to make this clearer, please let me know.

***

## AUTHENTICATION USER INPUT AND HANDLING ERRORS

In this template the user input we use to authenticate a user or change a users details, happens mostly within the modals. There are many reasons we need to get user input - from signing up to changing the display name - and all of these have their own sets of boundaries and rules they have to follow in order to be valid and accepted into our database. We have this for a few reasons, the main ones being that we don't want to accept something like an email address that isnt really an email address and also security is a big concern. Think of SQL injections, for example. 

**HIGH LEVEL OVERVIEW**

To manage user input state, we are using a reducer within React. We do this because each input has two different values which need to be re-evaluated each time a user changes the value inside of the input. These properties are: the 'userInput.value' and the 'userInput.isValid'. The value property is, let's say the display name, which a user has typed into the input. And the isValid property is a boolean, which uses one of our validator functions, found inside of useValidateUserInput() hook to determine whether or not that entered input is valid. 

So, if the user has typed 'Rene' in as their display name then the 'userInput.value' would be 'Rene'. And by extension since the parameters set on the 'validateDisplayName()' function, which determines the value of 'userInput.isValid', is set to return 'true' only if the entered display name contains just alphabetic characters and is between 1 & 15 characters long, then the 'userInput.isValid' would be 'true'.

These validator functions run on every change event within the associated user input. So, if a user enters 'R' as their display name, then the 'isValid' property will be true. But if they change their mind and hit 'backspace' deleting the 'R' then the empty string now within the user input will mean that the 'isValid' property will be 'false'. Users inherently know they can't have an empty display name and are more than likely about type something new into the field. We don't want to annoy them by having an error message popping up on the screen telling them to do something they're already about to do. So, to largely combat this, there is a small safe guard where the error messages only show up once the forms submit button has been clicked. On the handleSubmit functions there are further safe guards so that the form won't actually submit if its invalid, so don't worry about that. Instead it will prompt the user for the correct information / formatting until the user corrects these errors and submits the form correctly.
