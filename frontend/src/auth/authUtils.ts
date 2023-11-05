async function isAuth() {
    // Check if the user is authorized
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        // No token found, redirect to the login page
        return false;
    } else {
        try {
            const response = await fetch('http://localhost:3001/auth/tokenverify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ authToken }),
            });

            if (response.ok) {
                return true;
            } else {
                console.log(response);
                return false;
            }
        } catch (error) {
            console.error('Error:', error);
            return false;
        }
    }
}

export { isAuth };
