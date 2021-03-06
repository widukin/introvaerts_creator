import { useState, useEffect } from 'react';

// api
import Api from '../../../shared/utils/api';
// shared components
import SectionContainer from '../../../shared/components/SectionContainer';
import FormRow from '../../../shared/components/FormRow';
import GalleryRow from '../../../shared/components/GalleryRow';
import FormRowArea from '../../../shared/components/FormRowArea';
import ImageRow from '../../../shared/components/ImageRow';
import Button from '../../../shared/components/Button';
// settings
import { allowedNumberOfGalleries } from '../../../shared/config/app.settings';
// time delay for firing API call
import useDebounce from '../../../shared/utils/hooks/useDebounce';
import ImagePreview from '../../../shared/components/ImagePreview';
import Loading from '../../../shared/components/Loading';

const Content = ({ subdomain, publishedSubdomainName }) => {
  // change name of subdomain to data for better code reading
  const data = subdomain;

  const [errorMessages, setErrorMessages] = useState({});
  const [userInput, setUserInput] = useState({
    subdomain_name: '',
    page_title: '',
    tagline: '',
    description: '',
    galleryName: '',
    galleries: [],
    contact_tagline: '',
    first_name: '',
    last_name: '',
    business_email: '',
    phone_number: '',
    street_and_number: '',
    postalcode: '',
    city: '',
    country: '',
  });

  // states for checking if subdomain name is availabe when stop typing
  const [isAvailable, setIsAvailable] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const [loading, setLoading] = useState(false);

  // costum hook return latest value (after 500ms) or previous value of subdomain_name (only have the API call fire when user stops typing)
  const debouncedSubdomainName = useDebounce(userInput.subdomain_name, 500);

  useEffect(() => {
    let newUserInput = { galleryName: '' };
    if (data.subdomain) {
      const { name, page_title } = data.subdomain;
      // gather gallery name and id
      let galleriesArray = [];
      data.galleries.forEach(gallery => {
        galleriesArray.push({ name: gallery.name, id: gallery._id });
      });
      // cut off -preview of preview subdomain name
      let alteredPreviewSubdomainName = name.replace('-preview', '');
      newUserInput = {
        ...newUserInput,
        subdomain_name: alteredPreviewSubdomainName
          ? alteredPreviewSubdomainName
          : '',
        page_title: page_title ? page_title : '',
        galleries: galleriesArray ? galleriesArray : [],
      };

      // is there a about object inside subdomain?
      if (data.subdomain.about) {
        const { tagline, description } = data.subdomain.about;

        newUserInput = {
          ...newUserInput,
          tagline: tagline ? tagline : '',
          description: description ? description : '',
        };
      }
      // is there a contact object inside subdomain?
      if (data.subdomain.contact) {
        const {
          first_name,
          last_name,
          contact_tagline,
          business_email,
          phone_number,
        } = data.subdomain.contact;

        newUserInput = {
          ...newUserInput,
          first_name: first_name ? first_name : '',
          last_name: last_name ? last_name : '',
          contact_tagline: contact_tagline ? contact_tagline : '',
          business_email: business_email ? business_email : '',
          phone_number: phone_number ? phone_number : '',
        };
        // is there an address object inside contact?
        if (data.subdomain.contact.address) {
          const {
            street_and_number,
            postalcode,
            city,
            country,
          } = data.subdomain.contact.address;

          newUserInput = {
            ...newUserInput,
            street_and_number: street_and_number ? street_and_number : '',
            postalcode: postalcode ? postalcode : '',
            city: city ? city : '',
            country: country ? country : '',
          };
        }
      }
      setUserInput(newUserInput);
    }
  }, [data]);

  const handleSubmit = e => {
    e.preventDefault();
    if (userInput.galleryName.length) {
      createGallery();
    }
    editSubdomain();
  };

  const handleUserInput = e => {
    const { name, value } = e.target;
    // error handling
    if (name === 'subdomain_name') {
      const regex = /(^[a-z0-9-]+$)/;
      // if regex does not match write error message
      if (!regex.test(value)) {
        setErrorMessages({
          ...errorMessages,
          subdomainNameMatchRegex: `The subdomain name must consist of lowercase letters and numbers and may conatain a dash (-).`,
        });
      } else {
        setErrorMessages({
          ...errorMessages,
          subdomainNameMatchRegex: '',
        });
      }
    }
    setUserInput(userInput => ({
      ...userInput,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (
      debouncedSubdomainName &&
      // check if subdomain-preview is not the own one
      `${debouncedSubdomainName}-preview` !== data.subdomain.name &&
      // check if the subdomain is not the own one
      debouncedSubdomainName !== publishedSubdomainName
    ) {
      setIsSearching(true);
      const is = async () => {
        // check if subdomain name is used as published subdomain name
        const response = await Api.subdomainAvailable(debouncedSubdomainName);
        setIsAvailable(response.isAvailable);
        if (response.isAvailable) {
          // check if subdomain name is used as a preview subdomain name
          const responsePreview = await Api.subdomainAvailable(
            debouncedSubdomainName + '-preview'
          );
          setIsAvailable(responsePreview.isAvailable);
        }
        setIsSearching(false);
      };
      is();
    } else {
      setIsAvailable(true);
    }
  }, [debouncedSubdomainName]);

  const editSubdomain = async () => {
    try {
      if (userInput.image) {
        setLoading(true);
        await Api.postAboutImage(appendFormData());
      }
      // check if there are any error messages and allow editSubdomain only if error=false
      let error = false;
      for (const key in errorMessages) {
        if (Object.hasOwnProperty.call(errorMessages, key)) {
          if (errorMessages[key]) {
            error = true;
            console.log('error?: ', errorMessages[key]);
          }
        }
      }
      if (!error) {
        const res = await Api.editSubdomain(
          data.subdomain._id,
          `${userInput.subdomain_name}-preview`,
          userInput
        );
        if (res.code === 204) {
          window.location.href = `/dashboard/preview`;
        }
      }
    } catch (e) {
      console.error(Error(e));
    }
  };

  // when isAvailable changes setErrorMessage
  useEffect(() => {
    if (!isAvailable) {
      setErrorMessages({
        ...errorMessages,
        subdomainNameAvailable: `This subdomain name is not available.`,
      });
    } else {
      setErrorMessages({
        ...errorMessages,
        subdomainNameAvailable: '',
      });
    }
  }, [isAvailable]);

  // when isSearching changes setErrorMessage
  useEffect(() => {
    if (!isSearching) {
      setErrorMessages({
        ...errorMessages,
        searching: '',
      });
    } else {
      setErrorMessages({
        ...errorMessages,
        searching: 'seaching ...',
      });
    }
  }, [isSearching]);

  // upload about image
  const onSelectFile = (key, e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        if (key === 'aboutImage') {
          document.getElementById('imagePreview').src = reader.result;
        }
      });
      reader.readAsDataURL(e.target.files[0]);
      setUserInput({ ...userInput, image: e.target.files[0] });
    }
  };

  const appendFormData = () => {
    const formData = new FormData();
    formData.append('subdomain_id', data.subdomain._id);
    Object.entries(userInput).forEach(field => {
      if (['tagline', 'description', 'image'].includes(field[0])) {
        formData.append(field[0], field[1]);
      }
    });
    return formData;
  };

  const createGallery = async () => {
    const { galleryName } = userInput;
    if (
      galleryName.trim() &&
      userInput.galleries.length < allowedNumberOfGalleries
    ) {
      const response = await Api.createGallery(
        userInput.galleryName,
        data.subdomain._id
      );
      userInput.galleries = [
        ...userInput.galleries,
        { id: response.data._id, name: response.data.name },
      ];
      setErrorMessages({
        ...errorMessages,
        galleryName: '',
      });
    } else if (galleryName.trim().length === 0) {
      // Error message if user tries to add empty gallery
      setErrorMessages({
        ...errorMessages,
        galleryName: `Only white space is not allowed as a gallery name.`,
      });
    } else if (userInput.galleries.length >= allowedNumberOfGalleries) {
      // Error message if user enters more than the allowed number of galleries
      setErrorMessages({
        ...errorMessages,
        galleryName: `You can create ${allowedNumberOfGalleries} galleries only.`,
      });
    }
    //clear galleryName in userInput
    setUserInput(userInput => ({
      ...userInput,
      galleryName: '',
    }));
  };

  return (
    <>
      {!loading ? (
        <form method="POST" onSubmit={handleSubmit}>
          {/* Subdomain */}
          <SectionContainer border="yes" padding="2" id="subdomain">
            <h2>Subdomain</h2>
            <FormRow
              width="25"
              marginLeft="33"
              htmlFor="subdomain_name"
              label="subdomain name"
              type="text"
              id="subdomain_name"
              name="subdomain_name"
              value={userInput.subdomain_name}
              required={true}
              handleChange={handleUserInput}
              errorMessage={
                errorMessages.searching ||
                errorMessages.subdomainNameMatchRegex ||
                errorMessages.subdomainNameAvailable
              }
            />
          </SectionContainer>
          {/* HEADER */}
          <SectionContainer border="yes" padding="2" id="header">
            <h2>Header</h2>
            <FormRow
              width="25"
              marginLeft="33"
              htmlFor="page_title"
              label="page title"
              type="text"
              id="page_title"
              name="page_title"
              value={userInput.page_title}
              required={true}
              handleChange={handleUserInput}
            />
          </SectionContainer>
          {/* ABOUT */}
          <SectionContainer border="yes" padding="2" id="about">
            <h2>About</h2>
            <FormRow
              width="25"
              marginLeft="33"
              htmlFor="tagline"
              label="tagline"
              type="text"
              id="tagline"
              name="tagline"
              value={userInput.tagline}
              required={false}
              handleChange={handleUserInput}
            />
            <FormRowArea
              width="25"
              marginLeft="33"
              htmlFor="description"
              label="description"
              type="text"
              id="description"
              name="description"
              value={userInput.description}
              required={false}
              handleChange={handleUserInput}
            />
            <ImageRow
              width="25"
              marginLeft="33"
              align="center"
              label="Upload Your Image"
              accept="image/*"
              name="aboutImage"
              type="file"
              handleChange={e => onSelectFile('aboutImage', e)}
            />
            {data?.subdomain?.about?.about_image_url || userInput.image ? (
              <ImagePreview
                id="imagePreview"
                src={
                  userInput.image
                    ? userInput.image
                    : data?.subdomain?.about?.about_image_url
                }
                width="15"
                height="15"
                left="74"
              />
            ) : null}
          </SectionContainer>
          {/* GALLERY */}
          <SectionContainer border="yes" padding="2" id="gallery">
            <h2>Gallery</h2>
            <GalleryRow
              width="35"
              htmlFor="galleryName"
              label="gallery name"
              type="text"
              id="galleryName"
              name="galleryName"
              value={userInput.galleryName}
              required={false}
              handleChange={handleUserInput}
              handleClick={createGallery}
              galleries={userInput.galleries}
              errorMessage={errorMessages.galleryName}
            />
          </SectionContainer>
          {/* CONTACT */}
          <SectionContainer border="yes" padding="2" id="contact">
            <h2>Contact</h2>
            <FormRow
              width="25"
              marginLeft="33"
              htmlFor="contact_tagline"
              label="motivate your fellows to contact you"
              type="text"
              id="contact_tagline"
              name="contact_tagline"
              value={userInput.contact_tagline}
              required={false}
              handleChange={handleUserInput}
            />
            <FormRow
              width="25"
              marginLeft="33"
              htmlFor="first_name"
              label="first name"
              type="text"
              id="first_name"
              name="first_name"
              value={userInput.first_name}
              required={true}
              handleChange={handleUserInput}
            />
            <FormRow
              width="25"
              marginLeft="33"
              htmlFor="last_name"
              label="last name"
              type="text"
              id="last_name"
              name="last_name"
              value={userInput.last_name}
              required={true}
              handleChange={handleUserInput}
            />
            <FormRow
              width="25"
              marginLeft="33"
              htmlFor="business_email"
              label="business_email"
              type="email"
              id="business_email"
              name="business_email"
              value={userInput.business_email}
              pattern='^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$'
              title="Please put in a valid email address: accountname@domainname.domain"
              required={true}
              handleChange={handleUserInput}
            />
            <FormRow
              width="25"
              marginLeft="33"
              htmlFor="phone_number"
              label="phone_number"
              type="tel"
              id="phone_number"
              name="phone_number"
              value={userInput.phone_number}
              required={false}
              handleChange={handleUserInput}
            />
            <FormRow
              width="25"
              marginLeft="33"
              htmlFor="street_and_number"
              label="street and number"
              type="text"
              id="street_and_number"
              name="street_and_number"
              value={userInput.street_and_number}
              required={false}
              handleChange={handleUserInput}
            />
            <FormRow
              width="25"
              marginLeft="33"
              htmlFor="postalcode"
              label="postalcode"
              type="text"
              id="postalcode"
              name="postalcode"
              value={userInput.postalcode}
              required={false}
              handleChange={handleUserInput}
            />
            <FormRow
              width="25"
              marginLeft="33"
              htmlFor="city"
              label="city"
              type="text"
              id="city"
              name="city"
              value={userInput.city}
              required={false}
              handleChange={handleUserInput}
            />
            <FormRow
              width="25"
              marginLeft="33"
              htmlFor="country"
              label="country"
              type="text"
              id="country"
              name="country"
              value={userInput.country}
              required={false}
              handleChange={handleUserInput}
            />
          </SectionContainer>
          {/* SUBMIT */}
          <SectionContainer borderBottom="yes" padding="2" align="center">
            <Button type="submit" text="Submit" />
          </SectionContainer>
        </form>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default Content;
