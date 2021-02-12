import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { SpotifyContextProvider } from '../src/context/spotify-context-provider';
import MyPlaylists from './my-playlists';

const clientId = '3c5666e14ae14e39a0efc18f540d621e';
const scope =
    'user-read-private user-read-email playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private';

const App = () => {
    const handleErrors = (error: any) => console.error(error);

    return (
        <div>
            <SpotifyContextProvider
                clientId={clientId}
                scope={scope}
                onError={handleErrors}
            >
                <MyPlaylists />
            </SpotifyContextProvider>
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));
