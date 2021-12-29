import React, { useState } from 'react';
import styled from 'styled-components';
import { UTC } from '../utils/UTCDate';

const Container = styled.div`
  display: grid;
  grid-template-rows: max-content max-content;
  gap: 0.5rem;
`;

const CalendarControlContainer = styled.div`
  display: grid;
  justify-content: space-between;
  grid-auto-flow: column;
`;

const MonthYearLabel = styled.div`
  align-self: center;
  text-align: center;
`;

const MonthRollButton = styled.button`
  padding: 0rem;
  border: none;
  background-color: transparent;
  color: transparent;
  width: 0rem;
  height: 0rem;
  border-radius: 0.125rem;
  border-top: 0.5rem solid transparent;
  border-bottom: 0.5rem solid transparent;
  transition: transform 50ms;
  &:hover {
    transform: scale(1.1);
  }
  &:active {
    transform: scale(1.2);
  }
`;

const LeftMonthRollButton = styled(MonthRollButton)`
  border-right: 2rem solid white;
`;

const RightMonthRollButton = styled(MonthRollButton)`
  border-left: 2rem solid white;
`;

const Calendar = styled.div`
  display: grid;
  grid-row: 2;
  grid-template-columns: repeat(7, 2rem);
  grid-template-rows: repeat(6, 2rem);
  gap: 0.125rem;
`;

interface DayProps {
  readonly deEmphasized: boolean;
  readonly highlighted: boolean;
}

const Day = styled.button<DayProps>`
  background-color: ${(props) =>
    props.highlighted
      ? props.deEmphasized
        ? props.theme.colors.secondary.main
        : props.theme.colors.primary.main
      : props.deEmphasized
      ? props.theme.colors.secondary.light
      : props.theme.colors.primary.light};
  border: none;
  padding: 0rem;
  font-family: monospace;
  font-size: 1em;
  font-weight: bold;
  user-select: none;
  border-radius: 0.25rem;
  color: ${(props) =>
    props.highlighted
      ? props.theme.colors.text.light
      : props.theme.colors.text.dark};
  text-align: center;
  transition: border 100ms;
  &:hover {
    border: 1px solid
      ${({ highlighted }) => (highlighted ? '#ffffff' : '#000000')};
  }
`;

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

export interface DatePickerProps {
  date: UTC | undefined;
  setDate: React.Dispatch<React.SetStateAction<UTC | undefined>>;
  isHighlighted?: (day: UTC, month: UTC) => boolean;
  isDeEmphasized?: (day: UTC, month: UTC) => boolean;
  isDisabled?: (day: UTC, month: UTC) => boolean;
}

export function DatePicker({
  date,
  setDate,
  isHighlighted = (day, _month) => day.getTime() === date?.getTime(), // Highlight the selected date by default.
  isDeEmphasized = (day, month) => day.getUTCMonth() !== month.getUTCMonth(), // De-emphasize off-month days by default.
  isDisabled
}: DatePickerProps): JSX.Element {
  const [month, setMonthYear] = useState(
    new UTC(
      (date ?? new UTC()).getUTCFullYear(),
      (date ?? new UTC()).getUTCMonth()
    )
  );

  return (
    <Container>
      <CalendarControlContainer>
        <LeftMonthRollButton
          onClick={() =>
            setMonthYear(
              new UTC(month.getUTCFullYear(), month.getUTCMonth() - 1)
            )
          }
        />
        <MonthYearLabel>{getLocaleMonthAndYear(month)}</MonthYearLabel>
        <RightMonthRollButton
          onClick={() =>
            setMonthYear(
              new UTC(month.getUTCFullYear(), month.getUTCMonth() + 1)
            )
          }
        />
      </CalendarControlContainer>
      <Calendar>
        {generateDates(month).map((day) => (
          <Day
            key={day.getTime()}
            deEmphasized={isDeEmphasized(day, month)}
            highlighted={isHighlighted(day, month)}
            onClick={() =>
              isDisabled?.(day, month) ||
              setDate(day.getTime() === date?.getTime() ? undefined : day)
            }
          >
            {day.getUTCDate()}
          </Day>
        ))}
      </Calendar>
    </Container>
  );
}
