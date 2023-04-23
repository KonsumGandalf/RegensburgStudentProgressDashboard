# user-backend-user-mail-management

The API needs endpoints for sending and confirming emails.
When a user registers, they should receive an email with
a JWT token to confirm their address. The email should contain
a link to a confirmation page with the token in the URL.
The page should verify the token and mark the address as confirmed.
Unconfirmed users should be prevented from accessing certain parts of the app.
