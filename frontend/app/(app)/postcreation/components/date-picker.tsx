import React, { useState } from 'react';
import { View } from 'react-native';
import Input from '../../../../components/input';
import { z, ZodError } from 'zod';

type DateFromDate = {
  date: string;
};

//Couldnt get this to work :((((
//Will ideally add the "/"s for you but I couldnt figure out how to do it without changing the Input component

const DATE_SCHEMA = z.object({
  date: z.string().regex(/([0-9]+(\/[0-9]+)+)/i, {
    message: 'Name must be at least 2 characters long',
  }),
});

export default function DatePicker() {
  //The default value and the hint for when empty
  //Is the current day month and year
  const dateHint: string = new Date().toLocaleDateString('en-US', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  });

  const [enteredDate, setEnteredDate] = useState(dateHint);
  const [dateError, setDateError] = useState<string | null>(null);

  //Vaidates user input
  const validateDate = (date: string) => {
    if (date.length > 8) {
      return false;
    }

    const numIndexes: number[] = [0, 1, 3, 4, 6, 7];

    for (let index = 0; index < numIndexes.length; index++) {
      const currIndex = numIndexes[index];
      if (!date.charAt(currIndex).match('^[0-9]')) {
        return false;
      }
    }
    return true;
  };

  //On change, check input
  const dateChanged = (e: string) => {
    setDateError(
      validateDate(e) ? null : 'Date must follow the format "MM/DD/YY"',
    );

    setEnteredDate(e);
  };

  return (
    <View className="h-[5vh] max-w-full justify-center items-center">
      <Input
        value={enteredDate}
        inputMode="text"
        title={'Dive Date'}
        placeholder={dateHint}
        onChangeText={dateChanged}
        error={dateError === null ? '' : dateError}
      />
    </View>
  );
}
