import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { SpotifyContextProvider } from '../src';
import MyPlaylists from './my-playlists';
import UserProfile from './user-profile';

const clientId = process.env.SPOTIFY_CLIENT_ID;
const scope =
    'user-read-private user-read-email playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private';

const App = () => {
    const handleErrors = (error: any) => console.error(error);

    if (clientId == null) {
        return (
            <div className="bg-red-100 p-8 m-2 rounded text-red-600 border border-red-600">
                To run this example, you must assign SPOTIFY_CLIENT_ID a value
                in your .env.local file:
                <span className="font-semibold pl-3">
                    SPOTIFY_CLIENT_ID=abcd123...
                </span>
            </div>
        );
    }

    return (
        <div>
            <SpotifyContextProvider
                clientId={clientId}
                scope={scope}
                onError={handleErrors}
            >
                <UserProfile />
                <MyPlaylists />
            </SpotifyContextProvider>
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));
