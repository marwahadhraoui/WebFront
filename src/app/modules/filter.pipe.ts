import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], field: string, value: string): any[] {
    if (!items) return [];
    if (!value || value === '') return items;
    
    return items.filter(item => {
      // Handle nested properties
      const fieldParts = field.split('.');
      let propertyValue = item;
      for (const part of fieldParts) {
        propertyValue = propertyValue?.[part];
      }
      
      return propertyValue?.toString().toLowerCase().includes(value.toLowerCase());
    });
  }
}