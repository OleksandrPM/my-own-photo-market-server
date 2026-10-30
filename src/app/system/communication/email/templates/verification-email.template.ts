export function buildEmailVerificationTemplate(
  verifyUrl: string,
  expiresInMinutes: number,
  userName?: string,
): string {
  const safeName = userName ? `${userName},` : '';

  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Email Verification</title>
    </head>

    <body style="margin:0; padding:0; background:#f5f5f5; font-family:Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; padding:40px;">
              
              <tr>
                <td style="font-size:20px; font-weight:bold; color:#333;">
                  ${safeName} please verify your email address
                </td>
              </tr>

              <tr>
                <td style="padding-top:20px; font-size:15px; color:#555; line-height:1.6;">
                  Thank you for signing up for <strong>My Own Photo Market</strong>!  
                  To complete your account setup, please confirm your email address.  
                  This verification link will remain valid for <strong>${expiresInMinutes} minutes</strong>.
                </td>
              </tr>

              <tr>
                <td align="center" style="padding:30px 0;">
                  <a href="${verifyUrl}"
                     style="
                       display:inline-block;
                       background:#4a6cf7;
                       color:#ffffff;
                       text-decoration:none;
                       padding:14px 28px;
                       border-radius:6px;
                       font-size:16px;
                       font-weight:bold;
                     ">
                    Verify Email
                  </a>
                </td>
              </tr>

              <tr>
                <td style="font-size:14px; color:#777; line-height:1.6;">
                  If the button above doesn’t work, copy and paste this link into your browser:
                </td>
              </tr>

              <tr>
                <td style="padding-top:10px; font-size:13px; color:#4a6cf7; word-break:break-all;">
                  ${verifyUrl}
                </td>
              </tr>

              <tr>
                <td style="padding-top:30px; font-size:12px; color:#aaa;">
                  If you didn’t create an account, you can safely ignore this email.
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
}
