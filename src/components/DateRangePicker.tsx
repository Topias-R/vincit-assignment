import React from 'react';
import styled from 'styled-components';
import { DatePicker, DatePickerProps } from './DatePicker';

const Container = styled.div`
  display: grid;
  grid-template-columns: max-content max-content;
  grid-template-rows: max-content max-content;
  column-gap: 1rem;
  row-gap: 0.5rem;
  padding: 1rem;
  border-radius: 0.25rem;
  margin: 1rem;
  box-shadow: 0.25rem 0.5rem 0.5rem hsl(0deg 0% 0% / 0.38);
  background-color: #1e1e1e;
`;

const RangeDisplay = styled.div``;

const LeftRangeDisplay = styled(RangeDisplay)`
  text-align: end;
`;

const RightRangeDisplay = styled(RangeDisplay)`
  text-align: 'start';
`;

interface DateRangePickerProps {
  startDate: DatePickerProps['date'];
  endDate: DatePickerProps['date'];
  setStartDate: DatePickerProps['setDate'];
  setEndDate: DatePickerProps['setDate'];
}

export function DateRangePicker({
  startDate,
  endDate,
  setStartDate,
  setEndDate
}: DateRangePickerProps): JSX.Element {
  return (
    <Container>
      <DatePicker
        date={startDate}
        setDate={setStartDate}
        isHighlighted={(day) =>
          day.getTime() === startDate?.getTime() ||
          (day.getTime() >= (startDate?.getTime() ?? Infinity) &&
            day.getTime() <= (endDate?.getTime() ?? -Infinity))
        }
        isDisabled={(day) => day.getTime() >= (endDate?.getTime() ?? Infinity)}
      />
      <DatePicker
        date={endDate}
        setDate={setEndDate}
        isHighlighted={(day) =>
          day.getTime() === endDate?.getTime() ||
          (day.getTime() <= (endDate?.getTime() ?? -Infinity) &&
            day.getTime() >= (startDate?.getTime() ?? Infinity))
        }
        isDisabled={(day) =>
          day.getTime() <= (startDate?.getTime() ?? -Infinity)
        }
      />
      <LeftRangeDisplay>
        {startDate?.toLocaleDateString() ?? ''}
      </LeftRangeDisplay>
      <RightRangeDisplay>
        {endDate?.toLocaleDateString() ?? ''}
      </RightRangeDisplay>
    </Container>
  );
}
