import { ComicIdResponse, ComicData } from './interfaces';
import { formatDistanceToNow } from 'date-fns';

document.addEventListener('DOMContentLoaded', () => {
  const email: string = 'p.belayev@innopolis.university';
  const urlParams = new URLSearchParams({ email });
  const comicIdUrl: string = `https://fwd.innopolis.university/api/hw2?${urlParams.toString()}`;

  fetch(comicIdUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error fetching comic ID: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data: number) => {
      console.log('Comic ID data:', data);

      const comicId = data;
      const comicUrl: string = `https://fwd.innopolis.university/api/comic?id=${comicId}`;
      console.log('Fetching comic data from URL:', comicUrl);

      return fetch(comicUrl);
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error fetching comic data: ${response.statusText}`);
      }
      return response.json();
    })
    .then((comicData: ComicData) => {
      console.log('Comic data:', comicData);

      if (!comicData.safe_title || !comicData.img || !comicData.year || !comicData.month || !comicData.day) {
        throw new Error('Invalid comic data format');
      }

      const titleElement = document.getElementById('comic-title') as HTMLHeadingElement;
      const imageElement = document.getElementById('comic-image') as HTMLImageElement;
      const dateElement = document.getElementById('comic-date') as HTMLParagraphElement;

      titleElement.textContent = comicData.safe_title;
      imageElement.src = comicData.img;
      imageElement.alt = comicData.alt;

      const date = new Date(
        parseInt(comicData.year, 10),
        parseInt(comicData.month, 10) - 1,
        parseInt(comicData.day, 10)
      );
      dateElement.textContent = formatDistanceToNow(date, { addSuffix: true });
    })
    .catch(error => {
      console.error('Error fetching comic data:', error);
    });
});
