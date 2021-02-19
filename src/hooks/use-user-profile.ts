import { useCallback, useEffect, useState } from 'react';
import { SpotifyUser } from '../models/Spotify';
import { useSpotify } from './use-spotify';

export function useUserProfile() {
    const { api } = useSpotify();
    const [loading, setLoading] = useState(true);
    const [userProfile, setUserProfile] = useState<SpotifyUser>();

    const loadData = useCallback(async () => {
        setLoading(true);

        const userProfileResult = await api<SpotifyUser>('me');

        if (userProfileResult != null) {
            setUserProfile(userProfileResult);
        }

        setLoading(false);
    }, [api]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return {
        loading,
        refresh: () => {
            loadData();
        },
        userProfile,
    };
}
