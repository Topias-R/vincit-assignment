import React, { useState } from 'react';
import styled from 'styled-components';
import { UTC } from '../utils/UTCDate';

const Container = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, min-content)',
  gridTemplateRows: 'repeat(2, min-content)',
  gap: '10px'
});

const CalendarControlContainer = styled.div({
  display: 'grid',
  gridAutoFlow: 'column'
});

const MonthYearLabel = styled.div({
  flexBasis: 1,
  textAlign: 'center'
});

const MonthRollButton = styled.button({});

const Calendar = styled.div({
  display: 'grid',
  gridRow: '2',
  gridTemplateColumns: 'repeat(7, 34px)',
  gridTemplateRows: 'repeat(6, 34px)',
  gap: '1px'
});

interface DayProps {
  readonly deEmphasized: boolean;
  readonly highlighted: boolean;
}

const Day = styled.div<DayProps>(({ deEmphasized, highlighted }) => ({
  backgroundColor: highlighted
    ? deEmphasized
      ? 'lightblue'
      : 'blue'
    : deEmphasized
    ? 'lightgray'
    : 'gray',
  color: 'white',
  textAlign: 'center'
}));

// Takes a date of any month and generates dates for a 42-slot calendar.
function generateDates(date: UTC): UTC[] {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();

  // getUTCDay returns 0 - 6 depending on the day of the week, starting from sunday.
  // We want weeks to start on monday, so we shift monday to be 0.
  const startOfMonthSunday = new UTC(year, month).getUTCDay();
  const startOfMonth = startOfMonthSunday === 0 ? 6 : startOfMonthSunday - 1;

  // Adding 34 days to the date object makes it automatically roll over to next month.
  // Taking the number of days it overflowed and subtracting it from 34 gets the amount of days in the month.
  const daysInMonth = 34 - new UTC(year, month, 34).getUTCDate();
  const daysInLastMonth = 34 - new UTC(year, month - 1, 34).getUTCDate();

  // Generate the days of the preceding month that fit into the first row.
  const daysOfPrecedingMonth = Array.from({ length: startOfMonth }, (_, i) => i)
    .reverse()
    .map((n) => new UTC(year, month - 1, daysInLastMonth - n));

  // Then the days of the month.
  const daysOfMonth = Array.from(
    { length: daysInMonth },
    (_, i) => new UTC(year, month, i + 1)
  );

  // And fill the rest of the 42 slots with days of the following month.
  const daysOfFollowingMonth = Array.from(
    { length: 42 - startOfMonth - daysInMonth },
    (_, i) => new UTC(year, month + 1, i + 1)
  );

  return [...daysOfPrecedingMonth, ...daysOfMonth, ...daysOfFollowingMonth];
}

function getLocaleMonthAndYear(date: UTC): string {
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'long'
  });
}

interface DatePickerProps {
  date: UTC;
  setDate: React.Dispatch<React.SetStateAction<UTC>>;
  isHighlighted?: (day: UTC) => boolean;
  isDeEmphasized?: (day: UTC) => boolean;
  isDisabled?: (day: UTC) => boolean;
}

export function DatePicker({
  date,
  setDate,
  isHighlighted,
  isDeEmphasized,
  isDisabled
}: DatePickerProps): JSX.Element {
  const [monthYear, setMonthYear] = useState(
    new UTC(date.getUTCFullYear(), date.getUTCMonth())
  );

  return (
    <Container>
      <CalendarControlContainer>
        <MonthRollButton
          onClick={() =>
            setMonthYear(
              new UTC(monthYear.getUTCFullYear(), monthYear.getUTCMonth() - 1)
            )
          }
        >
          &lt;
        </MonthRollButton>
        <MonthYearLabel>{getLocaleMonthAndYear(monthYear)}</MonthYearLabel>
        <MonthRollButton
          onClick={() =>
            setMonthYear(
              new UTC(monthYear.getUTCFullYear(), monthYear.getUTCMonth() + 1)
            )
          }
        >
          &gt;
        </MonthRollButton>
      </CalendarControlContainer>
      <Calendar>
        {generateDates(monthYear).map((day) => (
          <Day
            key={day.getTime()}
            deEmphasized={
              isDeEmphasized?.(day) ||
              day.getUTCMonth() !== monthYear.getUTCMonth() // De-emphasize off-month days by default.
            }
            highlighted={
              isHighlighted?.(day) || day.getTime() === date.getTime() // Highlight the selected date by default.
            }
            onClick={() => isDisabled?.(day) || setDate(day)} // No day is disabled by default.
          >
            {day.getUTCDate()}
          </Day>
        ))}
      </Calendar>
    </Container>
  );
}
