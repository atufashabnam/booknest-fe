export interface BookDTO {
    id: string;
    title: string;
    authors: string;
    description?: string;
    categories?: string;
    imageLinks: string;
    review?: ReviewDto;
  }
  
  
 export interface ReviewDto {
    id: number;
    rating: number;
    status: string;
    notes: string;
  }

export interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors: string[];
    description?: string;
    categories?: string[];
    imageLinks?: {
      smallThumbnail: string,
      thumbnail: string
    }

  };
}

export interface ModalProps {
  show: boolean;
  onClose: () => void;
  onSave: () => void;
  value: string;
  onChange: (value: string) => void;
  title: string;
}