OVERVIEW:

The website is a military training course website. The user can browse the home page, about, courses, and contact page.

If the user presses book in the courses page for any package then he'll be prompted to sign up.

Once signed up in the user dashboard the user can choose a course, select a date, and confirm a booking. 

Then in the dashboard the user sees action required, he must do all the steps to reserve their booking which includes:

Upload Required Documents
Fill Out Information Form
Pay €1000 Deposit (Required)

In the admin dashboard the admin can set the available dates for each course as well as see all the bookings and their status (Payment, filled in form) and download the docs that the user uploaded.

WHAT'S ALREADY IMPLEMENTED:

Authentication is implemented. Currently when the user books any course it uses localstorage, as well as the admin dashboard.

WHAT NEEDS TO DONE:

Basic 30$

1. The booking should be saved to superbase
2. Fill in form, upload docs, and payment status (deposit/pay in full) needs to be saved to the database.
3. The admin should be able to set the dates from the admin dashboard for each dates
4. The booking flow should be in sync, meaning the calendar dates should be in sync with the supabase backend.

Notes: Replace mock calls in the frontend user dashboard to supabase so it fetches all the bookings for the user, and the booking details, statuses.

Next step 30$
Any final touches we'll dicuss about them and you'll get paid another 30$, even if it's very minor. The booking flow, the user dashboard, and admin dashboard should be working correctly, uses supabase for all backend needs. 

When pushed to github it currently deploys to https://test.baldeagletactical.com/

Supbase account: simchapro@yopmail.com
Github project: https://github.com/elijahdev0/newsitesimcha