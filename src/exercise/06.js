// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js
import {ErrorBoundary} from 'react-error-boundary'

import * as React from 'react'
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    status: 'idle',
    error: null,
    pokemon: null,
  })

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }
    setState(previousState => ({...previousState, status: 'pending'}))
    fetchPokemon(pokemonName)
      .then(pokemon => {
        // 💰 Warning: Make sure you call setPokemon before calling setStatus. We’ll address that more in the next extra credit.
        // ? Why ? Answer above 🔼
        // setPokemon(pokemon)
        // setState('resolved')
        setState(previousStatus => ({
          ...previousStatus,
          status: 'resolved',
          pokemon,
        }))
      })
      .catch(error => {
        // setError(error)
        // setState('rejected')
        setState(previousStatus => ({
          ...previousStatus,
          status: 'rejected',
          error,
        }))
      })
  }, [pokemonName])

  if (state.status === 'idle') {
    return 'Submit a pokemon'
  }

  if (state.status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  }

  if (state.status === 'resolved') {
    return <PokemonDataView pokemon={state.pokemon} />
  }

  if (state.status === 'rejected') {
    throw state.error
  }

  throw new Error('This should not happen')
}

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again...</button>
    </div>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          // key={pokemonName}
          onReset={() => {
            setPokemonName('')
          }}
          resetKeys={[pokemonName]}
          FallbackComponent={ErrorFallback}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
        {/* <button
          onClick={() => {
            throw new Error('My Error')
          }}
        >
          My handler will throw an error
        </button> */}
      </div>
    </div>
  )
}

// class ErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props)
//     this.state = {hasError: false, error: null}
//   }

//   static getDerivedStateFromError(error) {
//     // Update state so the next render will show the fallback UI.
//     return {hasError: true, error}
//   }

//   componentDidCatch(error, errorInfo) {
//     // You can also log the error to an error reporting service
//     console.log(error, errorInfo)
//   }

//   render() {
//     if (this.state.hasError) {
//       // You can render any custom fallback UI
//       const FallBackComponent = this.props.FallBackComponent
//       return <FallBackComponent error={this.state.error} />
//     }

//     return this.props.children
//   }
// }

export default App
