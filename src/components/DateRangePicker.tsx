import React from 'react';
import styled from 'styled-components';
import { DatePicker, DatePickerProps } from './DatePicker';
import { Surface } from './Surface';

const Container = styled(Surface)`
  display: grid;
  grid-template-columns: max-content max-content;
  grid-template-rows: max-content max-content max-content;
  justify-content: center;
  column-gap: 1rem;
  row-gap: 0.5rem;
  padding: 1rem;
  margin: 1rem;
`;

const Label = styled.label`
  text-align: center;
`;

const RangeDisplay = styled.div`
  text-align: center;
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
      <Label>Start Date</Label>
      <Label>End Date</Label>
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
      <RangeDisplay>{startDate?.toLocaleDateString() ?? '-'}</RangeDisplay>
      <RangeDisplay>{endDate?.toLocaleDateString() ?? '-'}</RangeDisplay>
    </Container>
  );
}
