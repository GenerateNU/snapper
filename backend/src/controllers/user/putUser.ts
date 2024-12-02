import express from 'express';
import { UserService, UserServiceImpl } from '../../services/userService';
import sendFilesToS3 from '../../services/filesToS3';
import { NotFoundError } from '../../consts/errors';
const userService: UserService = new UserServiceImpl();


//Will get the user by the given ID
export const putUser = async (req: express.Request, res: express.Response) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res
        .status(400)
        .json({ error: 'User is not present in the current session!' });
    }
    const userFields = [
      'username',
      'email',
      'supabaseId',
      'badges',
      'diveLogs',
      'speciesCollected',
      'followers',
      'following',
      'profilePicture',
      'deviceTokens',
      'firstName',
      'lastName',
    ];

    function base64ToFile(base64: string, fileName: string, mimeType: string): File {
      // Remove the Base64 prefix if it exists
      const base64Data = base64.split(',')[1] || base64;

      // Decode the Base64 string
      const binaryString = atob(base64Data);
      const byteNumbers = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        byteNumbers[i] = binaryString.charCodeAt(i);
      }

      // Create a Blob from the binary data
      const blob = new Blob([byteNumbers], { type: mimeType });

      // Convert the Blob into a File
      return new File([blob], fileName, { type: mimeType });
    }


    for (const key in req.body) {
      if (!userFields.includes(key)) {
        res
          .status(400)
          .json({ error: 'That field does not exist in the schema!' });
      }

      if (key === 'profilePicture') {
        if (!req.body.profilePicture.base64) {
          continue;
        }
        const photo: any[] = [req.body.profilePicture];
        const link = await sendFilesToS3(photo);
        if (!link[0]) {
          res
            .status(400)
            .json({ error: 'Unable to push the photo to s3' });
        }
        req.body.profilePicture = link[0];
      }
    }



    //Should mutate the id with the given request
    await userService.editUserBySupabaseId(userId, req.body);

    //Return the OK status
    return res.status(200).json({
      message: 'Successfully updated user:' + userId,
    });
  } catch (err) {
    if (err instanceof NotFoundError) {
      return res.status(404).json({ error: err.message });
    }
    console.log(err);
    return res.status(500).json({
      error: 'Internal server error while updating user data.\n' + err,
    });
  }
};
