This is a work in progress React hooks library for using the Spotify Web Sdk.  Currently there are 2 hooks: `useSpotify` and `usePlaylist`

## Installation

```bash
npm install react-spotify-hooks
```
or

```bash
yarn add react-spotify-hooks
```

## Example Usage

**SpotifyContextProvider**

```typescriptreact
const clientId = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
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
```

**usePlaylist**

```typescriptreact
function Playlist() {
    const { id } = useParams<{ id: string }>();
    const { playlist, loading, loadMoreTracks, hasMoreTracks } = usePlaylist({
        id,
    });

    if (playlist?.id == null) {
        return null;
    }

    const { url } =
        playlist.images != null && playlist.images.length > 0
            ? playlist.images[0]
            : new ImageRecord();

    return (
        <>
            <div>
                <h2 className="text-sm antialiased font-bold tracking-widest uppercase">
                    {playlist.name}
                </h2>
                <div className="flex">
                    <div className="flex-none w-64 h-64">
                        <img
                            className="object-cover w-full h-full"
                            src={url}
                            alt={`${playlist.name} cover`}
                        />
                    </div>
                    <div className="flex-grow m-2">
                        <h3 className="text-sm text-gray-800">
                            {playlist.totalTracks} songs
                        </h3>
                        <span className="block text-xs text-gray-700">
                            by {playlist.owner?.display_name}
                        </span>
                    </div>
                </div>
                <div className="mt-4 font-semibold">Tracks</div>

                {playlist.tracks.map((item, index) => (
                    <TrackListing
                        key={`${item.track.id}_${index}`}
                        track={item}
                    />
                ))}

                {loading && <Loader message="Loading tracks..." />}
            </div>
        </>
    );
}
```

**useMyPlaylists**

```typescriptreact
function MyPlaylists() {
    const { playlists, loading, hasMore, loadMore } = useMyPlaylists();

    useEffect(() => {
        if (!loading && hasMore) {
            loadMore();
        }
    }, [loading, loadMore, hasMore]);

    return (
        <>
            <h1 className="p-4 text-xl font-bold">My Playlists</h1>
            <ul>
                {playlists.map(playlist => (
                    <Playlist key={playlist.id} playlist={playlist} />
                ))}
            </ul>
        </>
    );
}
```

**useSpotify**

```typescriptreact
function MyPlaylists() {
    const { getCurrentUserPlaylists } = useSpotify();

    const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
    const [nextPlaylistUrl, setNextPlaylistUrl] = useState<string>();
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (loaded) {
            return;
        }

        (async function getPlaylists() {
            const playlistsResult = await getCurrentUserPlaylists(
                nextPlaylistUrl
            );

            if (playlistsResult?.next == null) {
                setLoaded(true);
            }

            setPlaylists(prev => [...prev, ...(playlistsResult?.items ?? [])]);
            setNextPlaylistUrl(playlistsResult?.next ?? undefined);
        })();
    }, [nextPlaylistUrl]);

    return (
        <>
            <h1 className="p-4 text-xl font-bold">My Playlists</h1>
            <ul>
                {playlists.map(playlist => (
                    <Playlist playlist={playlist} />
                ))}
            </ul>
        </>
    );
}
```