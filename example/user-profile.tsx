import * as React from 'react';
import { useUserProfile } from '../src';

export default function UserProfile() {
    const { userProfile } = useUserProfile();

    return (
        <div className="bg-gray-800 flex">
            <img className="max-h-16" src={userProfile?.images[0].url} />
            <div className="flex-initial text-gray-100 p-4">
                <h1 className="font-sans text-xl font-semibold inline-block">
                    {userProfile?.display_name}
                </h1>
                <h2 className="inline-block px-2 bg-gray-100 text-gray-800 bold rounded-full text-xs font-bold ml-2">
                    {userProfile?.product}
                </h2>
            </div>
        </div>
    );
}
