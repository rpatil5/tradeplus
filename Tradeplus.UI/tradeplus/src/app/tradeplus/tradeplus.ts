import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { SecurityService } from '../services/security.service';
 
ModuleRegistry.registerModules([ AllCommunityModule ]);

@Component({
  selector: 'app-tradeplus',
  standalone: true,
  imports: [CommonModule, AgGridModule, FormsModule],  
  templateUrl: './tradeplus.html',
  styleUrls: ['./tradeplus.scss'],
  
})
export class TradePlusComponent {
  
  securityInput: string = '';
  rowData: any[] = [];
  errorMessage: string = '';

  constructor(private securityService: SecurityService) {}

  defaultColDef = {
    sortable: true,
    filter: true,
    floatingFilter: true,  
    resizable: true,
    editable: false,
    flex: 1, 
    minWidth: 120,
    cellStyle: { fontSize: '14px' }
  }

  // Column definitions for the ag-Grid
  columnDefs = [
    {
      headerName: 'Symbol',
      field: 'symbol',
      editable: false, 
      filter: 'agTextColumnFilter',
      minWidth: 100,
      cellStyle: { fontWeight: '600', color: '#1f2937' }
    },
    {
      headerName: 'Description',
      field: 'description',
      editable: false,
      minWidth: 200
    },
    {
      headerName: 'Price',
      field: 'price',
      editable: false,
      cellEditor: 'agTextCellEditor',
      valueParser: this.decimalValueParser,
      cellClass: 'numeric-cell',
      valueFormatter: this.currencyFormatter
    },
    {
      headerName: 'Buy/Sell',
      field: 'buySell',
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: ['Buy', 'Sell'] },
      minWidth: 100,
      cellStyle: (params: any) => {
        if (params.value === 'Buy') {
          return { color: '#059669', fontWeight: '600' };
        } else if (params.value === 'Sell') {
          return { color: '#dc2626', fontWeight: '600' };
        }
        return null;
      }
    },
    {
      headerName: 'Quantity',
      field: 'quantity',
      editable: true,
      cellEditor: 'agTextCellEditor',
      cellEditorParams: {
        inputType: 'number',
        min: 0.01,
        step: 0.01
      },
      valueParser: this.positiveDecimalValueParser,
      cellClass: 'numeric-cell',
      onCellValueChanged: this.onQuantityCellValueChanged.bind(this)
    },
    {
      headerName: 'Limit Price',
      field: 'limitPrice',
      editable: true,
      cellEditor: 'agTextCellEditor',
      cellEditorParams: {
        inputType: 'number',
        min: 0.01,
        step: 0.01
      },
      valueParser: this.positiveDecimalValueParser,
      cellClass: 'numeric-cell',
      valueFormatter: this.currencyFormatter,
      onCellValueChanged: this.onLimitPriceCellValueChanged.bind(this)
    },
    {
      headerName: 'Action',
      field: 'action',
      editable: false,
      width: 100,
      filter: false,
      suppressNavigable: true,
      cellRenderer: this.deleteButtonRenderer.bind(this)
    }
  ];

  /**
   * Formats currency values with $ symbol and 2 decimal places
   */
  currencyFormatter(params: any) {
    if (params.value === null || params.value === undefined || params.value === '') {
      return '';
    }
    const value = parseFloat(params.value);
    if (isNaN(value)) {
      return params.value;
    }
    return value.toFixed(2);
  }

  /**
   * Parses values for numeric columns ensuring that only valid decimal numbers are accepted.
   * If the newValue is not a number, the old value is retained.
   */
  decimalValueParser(params: any) {
    const newValue = params.newValue;
    const parsedValue = parseFloat(newValue);
    return !isNaN(parsedValue) ? parsedValue : params.oldValue;
  }

  /**
   * Parses values for numeric columns ensuring that only valid positive decimal numbers are accepted.
   * If the newValue is not a positive number, the old value is retained.
   */
  positiveDecimalValueParser(params: any) {
    const newValue = params.newValue;
    
    // Remove any non-numeric characters except decimal point
    const cleanedValue = newValue.toString().replace(/[^0-9.]/g, '');
    
    const parsedValue = parseFloat(cleanedValue);
    
    // Check if it's a valid positive number
    if (!isNaN(parsedValue) && parsedValue > 0) {
      return parsedValue;
    }
    
    // Return old value if invalid
    return params.oldValue || '';
  }

  /**
   * Validates quantity cell value changes
   */
  onQuantityCellValueChanged(params: any) {
    const value = params.newValue;
    if (value !== null && value !== undefined && value !== '') {
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue <= 0) {
        // Reset to old value if invalid
        params.node.setDataValue('quantity', params.oldValue || '');
        this.errorMessage = 'Quantity must be a positive number greater than 0';
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      }
    }
  }

  /**
   * Validates limit price cell value changes
   */
  onLimitPriceCellValueChanged(params: any) {
    const value = params.newValue;
    if (value !== null && value !== undefined && value !== '') {
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue <= 0) {
        // Reset to old value if invalid
        params.node.setDataValue('limitPrice', params.oldValue || '');
        this.errorMessage = 'Limit Price must be a positive number greater than 0';
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      }
    }
  }

  /**
   * Custom cell renderer that creates a Delete button.
   * Clicking the button will remove the corresponding row from the grid.
   */
  deleteButtonRenderer(params: any) {
    const button = document.createElement('button');
    button.innerText = 'Delete';
    button.classList.add('delete-button');
    button.addEventListener('click', () => {
      params.api.applyTransaction({ remove: [params.data] });
    });
    return button;
  }

  /**
   * Processes the security input field.
   * Splits the input based on semicolons and adds a new row for each symbol.
   */
  addSecurities() {
    if (!this.securityInput.trim()) {
      this.errorMessage = 'Please enter at least one security symbol.';
      return;
    }

    const securities = this.securityInput
      .split(';')
      .map(sec => sec.trim().toUpperCase())
      .filter(sec => sec); // filter out empty entries

    // Check for duplicates
    const existingSymbols = this.rowData.map(row => row.symbol);
    const duplicates = securities.filter(symbol => existingSymbols.includes(symbol));
    
    if (duplicates.length > 0) {
      this.errorMessage = `The following symbols already exist: ${duplicates.join(', ')}`;
      return;
    }
this.securityService.getSecurities(securities).subscribe(response => {
      let foundSecurities = response.foundSecurities;
      let missing = response.missingSymbols;
      let missingSymbols = missing.filter(symbol => existingSymbols.includes(symbol));
      if (missingSymbols.length > 0) {
        this.errorMessage = `The following symbols does not exist: ${missingSymbols.join(', ')}`;
        return;
      }
      securities.forEach(symbol => {
        this.rowData = [
          ...this.rowData,
          foundSecurities.find(sec => sec.symbol === symbol)
        ];
      });
    }, error => {
      this.errorMessage ='Error fetching securities:' + error.message;
    });
    

    // Clear the input and any previous error message
    this.securityInput = '';
    this.errorMessage = '';
  }

  fetchSecurities() {
    const symbols = ['AAPL', 'GOOG', 'MSFT']; // Example symbols
    
  }

  /**
   * Validates each grid row to ensure that both 'quantity' and 'buySell' are provided.
   * If any rows are incomplete, an error message is built containing the corresponding symbols.
   * If all rows are valid, the data is processed (currently logged to the console).
   */
  submitData() {
    if (this.rowData.length === 0) {
      this.errorMessage = 'Please add at least one security before submitting.';
      return;
    }

    let errorSymbols: string[] = [];
    this.rowData.forEach(row => {
      // Check if quantity or buySell is empty (or null) or quantity is not a positive number
      const quantity = parseFloat(row.quantity);
      const limitPrice = parseFloat(row.limitPrice);
      
      if (row.quantity === '' || row.buySell === '' || 
          row.quantity === null || row.buySell === null || 
          isNaN(quantity) || quantity <= 0 ||
          (row.limitPrice !== '' && row.limitPrice !== null && (isNaN(limitPrice) || limitPrice <= 0))) {
        errorSymbols.push(row.symbol);
      }
    });
    
    if (errorSymbols.length > 0) {
      this.errorMessage = 'Please enter valid quantity (positive number) and select buy/sell for: ' + errorSymbols.join(', ');
    } else {
      this.errorMessage = '';
      console.log("Submitted Data:", this.rowData);
      
      // Show success message (you can customize this)
      alert('Trading orders submitted successfully!');
      
      // Optionally clear the data after submission
      // this.rowData = [];
    }
  }
}