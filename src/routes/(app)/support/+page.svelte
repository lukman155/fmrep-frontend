<script>
  import TextArea from '../../../lib/components/TextArea.svelte';
import InputField from './../../../lib/components/InputField.svelte';

  let name = ''
  let email = ''
  let subject = ''
  let message = ''

</script>
  <header>
    <h1>FMRepex Support</h1>
  </header>

  <main>
    <section>
      <h2>Contact Information</h2>
      <p>If you need assistance, please contact us using the following information:</p>
      <ul>
        <li>Email: support@fmrepex.com</li>
        <li>Phone: +1 (555) 123-4567</li>
      </ul>
    </section>

    <section>
      <h2>Frequently Asked Questions (FAQs)</h2>
      <p>Here are some common questions and answers:</p>
      <ul>
        <li>
          <strong>Q: How do I reset my password?</strong>
          <p>A: You can reset your password by visiting the login page and clicking on the "Forgot Password" link.</p>
        </li>
        <li>
          <strong>Q: How do I change my password?</strong>
          <p>A: You can reset your password by visiting the settings page and clicking on the "Change Password" link.</p>
        </li>
        <li>
          <strong>Q: How can I update my account information?</strong>
          <p>A: You can update your account information in the settings section of your account dashboard.</p>
        </li>
        <!-- Add more FAQs as needed -->
      </ul>
    </section>

    <section>
      <h2>Submit a Support Ticket</h2>
      <p>If you couldn't find the answer to your question in the FAQs, you can submit a support ticket below:</p>
      <form action="/submit-ticket" method="post">
        <!-- Add form fields for name, email, subject, and message -->
        <InputField label={'Name*'} bind:value={name} required />
        <InputField label={'Email*'} bind:value={email} required />
        <InputField label={'Subject'} bind:value={subject} />
        <TextArea label={'Message*'} bind:value={message} />

        <button type="submit">Submit Ticket</button>
      </form>
    </section>
  </main>

  <footer>
    <p>&copy; 2023 FMRepex. All rights reserved.</p>
  </footer>

  <style>

    form {
      display: flex;
      flex-direction: column;
      padding: 1em;

    }

    header {
      background-color: white;
      color: #4A9C48;
      text-align: center;
      padding: 1em;
    }

    main {
      margin: 20px auto;
      padding: 20px;
      background-color: white;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    h2 {
      color: #333;
    }

    p {
      line-height: 1.6;
      color: #666;
    }

    ul {
      list-style: none;
      padding: 0;
    }

    li {
      margin-bottom: 10px;
    }

    footer {
      color: #4A9C48;
      text-align: center;
      padding: 1em;
    
      width: 100%;
    }
  </style>
