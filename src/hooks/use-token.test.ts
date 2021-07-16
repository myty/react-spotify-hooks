import useToken, { UseTokenState } from './use-token';
import { act, renderHook } from '@testing-library/react-hooks';

const localStorageSetItemMock = jest.spyOn(
    window.localStorage.__proto__,
    'setItem'
);

const localStorageGetItemMock = jest
    .spyOn(window.localStorage.__proto__, 'getItem')
    .mockImplementation(() => null);

describe('useToken()', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should return', () => {
        // Arrange & Act
        const { result } = renderHook(() => useToken());

        // Assert
        expect(result.current).toBeDefined();
    });

    describe('when token is saved in localStorage', () => {
        it('returns token state', () => {
            // Arrange
            const savedTokenState: UseTokenState = {
                tokenType: 'tokenType',
                accessToken: 'accessToken',
            };

            localStorageGetItemMock.mockReturnValue(
                JSON.stringify(savedTokenState)
            );

            // Act
            const {
                result: { current },
            } = renderHook(() => useToken());

            // Assert
            expect(current.accessToken).toEqual(savedTokenState.accessToken);
            expect(current.tokenType).toEqual(savedTokenState.tokenType);
        });
    });

    describe('when setToken is called', () => {
        it('saves token state to localStorage', () => {
            // Arrange
            const setItemMock = jest.fn();
            localStorageSetItemMock.mockImplementation(setItemMock);

            const tokenState: UseTokenState = {
                tokenType: 'tokenType',
                accessToken: 'accessToken',
            };

            const {
                result: { current },
            } = renderHook(() => useToken());

            // Act
            act(() =>
                current.setToken(tokenState.tokenType!, tokenState.accessToken!)
            );

            // Assert
            expect(setItemMock).toHaveBeenCalledWith(
                expect.anything(),
                JSON.stringify(tokenState)
            );
        });
    });
});
